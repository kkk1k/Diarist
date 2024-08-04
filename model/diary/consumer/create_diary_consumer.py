import json
import os
import sys

import django
from confluent_kafka import Consumer, KafkaError
from django.conf import settings

sys.path.append('/app/')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from diary.tasks import process_message

KAFKA_BROKER_URL = settings.KAFKA_BROKER_URL
CREATE_DIARY_TOPIC = settings.KAFKA_TOPIC_CREATE
GROUP_ID = settings.KAFKA_CREATE_GROUP


def consume():
    consumer = Consumer({
        'bootstrap.servers': KAFKA_BROKER_URL,
        'group.id': GROUP_ID,
        'auto.offset.reset': 'earliest'
    })

    consumer.subscribe([CREATE_DIARY_TOPIC])

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

        try:
            data = json.loads(msg.value().decode('utf-8'))
            process_message.delay(data)
        except json.JSONDecodeError as e:
            print(f"Failed to decode message: {e}")
            continue

    consumer.close()


if __name__ == "__main__":
    consume()
