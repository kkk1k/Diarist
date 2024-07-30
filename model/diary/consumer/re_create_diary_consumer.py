import json
import os
import sys
from collections import Counter
from datetime import datetime

import django
from confluent_kafka import Consumer, KafkaError, Producer
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
RE_CREATE_DIARY_TOPIC = settings.KAFKA_TOPIC_RECREATE
RESPONSE_DIARY_TOPIC = settings.KAFKA_TOPIC_RESPONSE
GROUP_ID = settings.KAFKA_RECREATE_GROUP
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


def emphasize_keywords(keywords):
    '''
    자주 나온 키워드를 강조
    '''
    counter = Counter(keywords)
    emphasized_keywords = []
    for keyword, count in counter.items():
        emphasized_keywords.append((keyword + " ") * count)
    return ' '.join(emphasized_keywords)


def generate_description(diary_text, artist_style, emotion):
    '''
    GPT description 생성
    '''
    keywords = extract_keywords(diary_text)
    translated_diary_text = translate_text(diary_text)
    translated_emotion = translate_text(emotion)
    emphasized_keywords = emphasize_keywords([translate_text(keyword) for keyword in keywords])

    query = (f"Generate a simple, non-exaggerated description of a single scene based on the diary entry: '{translated_diary_text}'. "
             f"The description should be in the style of {artist_style} and focus only on the essential elements mentioned in the diary. "
             f"Ensure that the following keywords are included and emphasized: {emphasized_keywords}. "
             f"Reflect the emotion '{translated_emotion}' throughout the painting. "
             f"Do not add any additional details or elements, and ensure no people are included in the description. "
             f"The painting should reflect the distinctive style of {artist_style}, including key characteristics like color palette, brush strokes, and composition. "
             f"Draw the picture without being subject to copyright and content violation policies.")
    
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": (f"Create a simple, clear description of a single scene based on the user's diary entry, focusing on the landscape and objects mentioned. "
                                           f"Ensure the following emphasized keywords are included: {emphasized_keywords}. "
                                           f"Reflect the emotion '{translated_emotion}' throughout the painting. "
                                           f"Do not include any people. Follow the specified {artist_style} style without exaggeration or adding extra elements.")},
            {"role": "user", "content": query}
        ],
    )
    return response.choices[0].message.content


def generate_image(description):
    '''
    DALL-E 3를 사용하여 설명(description)에 기반한 이미지 생성
    '''
    response = client.images.generate(
        model="dall-e-3",
        prompt=description,
        size="1024x1024",
        quality="standard",
        n=1
    )
    return response.data[0].url


def send_response(user_id, diary_id):
    producer = Producer({'bootstrap.servers': KAFKA_BROKER_URL})
    response_message = json.dumps({"diary_id": diary_id, "user_id": user_id})
    producer.produce(RESPONSE_DIARY_TOPIC, key=str(diary_id), value=response_message)
    producer.flush()


def process_message(message):
    try:
        data = json.loads(message.value().decode('utf-8'))
        print(f"Received message: {data}")

        user_id = data['user_id']
        emotion_id = data['emotion_id']
        artist_id = data['artist_id']
        diary_date = datetime.strptime(data['diary_date'], '%Y-%m-%d')
        content = data['content']

        artist = Artist.objects.get(artist_id=artist_id)
        emotion = Emotion.objects.get(emotion_id=emotion_id)

        description = generate_description(content, artist.artist_name, emotion.emotion_name)
        image_url = generate_image(description)

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


def consume():
    consumer = Consumer({
        'bootstrap.servers': KAFKA_BROKER_URL,
        'group.id': GROUP_ID,
        'auto.offset.reset': 'earliest'
    })

    consumer.subscribe([RE_CREATE_DIARY_TOPIC])

    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue

        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(msg.error())
                break

        process_message(msg)

    consumer.close()

if __name__ == "__main__":
    consume()
