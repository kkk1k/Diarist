import json
import os
import sys
from datetime import datetime

import django
from celery import shared_task
from confluent_kafka import Producer
from openai import OpenAI
from deep_translator import GoogleTranslator
from konlpy.tag import Okt

sys.path.append('/app/')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from django.utils import timezone
from diary.models import Diary, User, Emotion, Image, Artist
from diary.utils import S3ImgUploader


KAFKA_BROKER_URL = settings.KAFKA_BROKER_URL
CREATE_DIARY_TOPIC = settings.KAFKA_TOPIC_CREATE
RESPONSE_DIARY_TOPIC = settings.KAFKA_TOPIC_RESPONSE
GROUP_ID = settings.KAFKA_CREATE_GROUP
OPENAI_API_KEY = settings.OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

okt = Okt()

def translate_text(text, src='ko', dest='en'):
    '''
    텍스트 번역
    '''
    translated = GoogleTranslator(source=src, target=dest).translate(text)
    return translated


def extract_keywords(text, top_n=10):
    '''
    KoNLPY를 사용하여 텍스트에서 명사 추출 및 중복 제거
    '''
    try:
        nouns = okt.nouns(text) 
        unique_nouns = list(nouns)
        translated_nouns = [translate_text(noun, src='ko', dest='en').lower() for noun in unique_nouns]
        if len(translated_nouns) == 0:
            raise ValueError("No keywords extracted")
    except (ValueError, IndexError) as e:
        print(f"키워드 추출에 실패했습니다. 기본 키워드를 사용합니다: {str(e)}")
        translated_nouns = text.split()[:top_n]
    return translated_nouns


# def generate_description(diary_text, artist_style, emotion):
#     '''
#     GPT description 생성
#     '''
#     keywords = extract_keywords(diary_text)
#     translated_diary_text = translate_text(diary_text)
#     translated_emotion = translate_text(emotion)

#     query = (f"Generate a simple, non-exaggerated description of a single scene based on the diary entry: '{translated_diary_text}'. "
#              f"The description should be in the style of {artist_style}, including key characteristics like color palette, brush strokes, and composition and focus only on the essential elements mentioned in the diary. "
#              f"Ensure that the following keywords are included and emphasized: {keywords}. "
#              f"Reflect the emotion '{translated_emotion}' throughout the painting. "
#              f"Do not add any additional details or elements, and ensure no people are included in the description. "
#              f"Draw the picture without being subject to copyright and content violation policies.")
    
#     response = client.chat.completions.create(
#         model="gpt-4",
#         messages=[
#             {"role": "system", "content": (f"Create a simple, clear description of a single scene based on the user's diary entry, focusing on the landscape and objects mentioned. "
#                                            f"Ensure the following emphasized keywords are included: {keywords}. "
#                                            f"Reflect the emotion '{translated_emotion}' throughout the painting. "
#                                            f"Do not include any people. Follow the specified {artist_style} style without exaggeration or adding extra elements.")},
#             {"role": "user", "content": query}
#         ],
#     )
#     return response.choices[0].message.content


def generate_image(diary_text, artist_style, emotion, artist_prompt, example_picture):
    '''
    DALL-E 3를 사용하여 설명(description)에 기반한 이미지 생성
    '''
    keywords = extract_keywords(diary_text)
    translated_diary_text = translate_text(diary_text)
    translated_emotion = translate_text(emotion)

    query = (f"Generate a detailed and image focusing on the landscape, objects, and atmosphere described in the diary entry: '{translated_diary_text}'. "
             f"Accurately reflect the style of {artist_style}, incorporating key characteristics such as color palette, brush strokes, composition, lighting, and texture unique to this artist. "
             f"The style should reflect the following description: {artist_prompt}. "
             f"Create an artwork that evokes the feeling and style of the example artwork: {example_picture}. "
             f"Focus on emphasizing the essential elements mentioned in the diary, including: {keywords}. but do not include any word or text in the image. "
             f"Reflect the emotion '{translated_emotion}' throughout the painting, capturing the mood and tone described in the diary entry. "
             f"Ensure the image captures the essence of the diary entry without adding any additional details or elements not present in the text. "
             f"Avoid including any people in the image, and strictly adhere to copyright and content policies.")

    response = client.images.generate(
        model="dall-e-3",
        prompt=query,
        size="1024x1024",
        quality="standard",
        n=1
    )
    return response.data[0].url


def send_response(user_id, diary_id):
    '''
    Kafka에 create-diary 토픽으로 메세지 전송
    '''
    producer = Producer({'bootstrap.servers': KAFKA_BROKER_URL})
    response_message = json.dumps({"diary_id": diary_id, "user_id": user_id})
    producer.produce(RESPONSE_DIARY_TOPIC, key=str(diary_id), value=response_message)
    producer.flush()

@shared_task
def process_message(data):
    '''
    사용자에게 입력받은 일기 데이터를 통해 그림이미지 생성 및 저장로직
    '''
    try:
        print(f"Received message: {data}")

        user_id = data['user_id']
        emotion_id = data['emotion_id']
        artist_id = data['artist_id']
        diary_date = datetime.strptime(data['diary_date'], '%Y-%m-%d')
        content = data['content']

        artist = Artist.objects.get(artist_id=artist_id)
        emotion = Emotion.objects.get(emotion_id=emotion_id)

        # description = generate_description(content, artist.artist_name, emotion.emotion_name)
        image_url = generate_image(content, artist.artist_name, emotion.emotion_name, artist.artist_prompt, artist.example_picture)
        
        print(f"Generated image URL: {image_url}")
    
        s3_url = S3ImgUploader.upload_from_url(image_url)

        if not s3_url:
            raise Exception("Failed to upload image to S3")

        image = Image.objects.create(image_url=s3_url)

        user = User.objects.get(user_id=user_id)

        new_diary = Diary(
            user=user,
            diary_date=diary_date,
            content=content,
            emotion=emotion,
            artist=artist,
            image=image
        )
        new_diary.save()

        send_response(user_id, new_diary.diary_id)
    
    except Diary.DoesNotExist:
        return f"Diary for user {user_id} on {diary_date} does not exist."
    except User.DoesNotExist:
        return f"User with id {user_id} does not exist."
    except Artist.DoesNotExist:
        return f"Artist with id {artist_id} does not exist."
    except Emotion.DoesNotExist:
        return f"Emotion with id {emotion_id} does not exist."
    except KeyError as e:
        return f"Missing key in message: {e}"
    except json.JSONDecodeError as e:
        return f"Error decoding JSON: {e}"
    except Exception as e:
        return f"Error processing message: {e}"

@shared_task
def re_process_message(data):
    '''
    사용자에게 입력받은 일기 데이터를 통해 그림이미지 재생성 및 저장로직
    '''
    try:
        print(f"Received message: {data}")

        user_id = data['user_id']
        emotion_id = data['emotion_id']
        artist_id = data['artist_id']
        diary_date = datetime.strptime(data['diary_date'], '%Y-%m-%d')
        content = data['content']

        artist = Artist.objects.get(artist_id=artist_id)
        emotion = Emotion.objects.get(emotion_id=emotion_id)

        # description = generate_description(content, artist.artist_name, emotion.emotion_name)
        image_url = generate_image(content, artist.artist_name, emotion.emotion_name, artist.artist_prompt, artist.example_picture)

        print(f"Generated image URL: {image_url}")
    
        s3_url = S3ImgUploader.upload_from_url(image_url)

        if not s3_url:
            raise Exception("Failed to upload image to S3")
        
        user = User.objects.get(user_id=user_id)

        diary = Diary.objects.get(user=user, diary_date=diary_date)

        old_image_url = diary.image.image_url
        diary_image = diary.image

        S3ImgUploader.delete_image(old_image_url)

        diary_image.image_url = s3_url
        diary_image.created_at = timezone.now()
        diary_image.save()

        diary.content = content
        diary.emotion = emotion
        diary.artist = artist
        diary.save()

        send_response(user_id, diary.diary_id)

    except Diary.DoesNotExist:
        return f"Diary for user {user_id} on {diary_date} does not exist."
    except User.DoesNotExist:
        return f"User with id {user_id} does not exist."
    except Artist.DoesNotExist:
        return f"Artist with id {artist_id} does not exist."
    except Emotion.DoesNotExist:
        return f"Emotion with id {emotion_id} does not exist."
    except KeyError as e:
        return f"Missing key in message: {e}"
    except json.JSONDecodeError as e:
        return f"Error decoding JSON: {e}"
    except Exception as e:
        return f"Error processing message: {e}"
