FROM python:3.11

ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app/

RUN apt-get update && \
    apt-get install -y openjdk-17-jdk && \
    apt-get clean

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV PATH=$JAVA_HOME/bin:$PATH

EXPOSE 8000

CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:8000 & python diary/consumer/create_diary_consumer.py & python diary/consumer/re_create_diary_consumer.py"]
