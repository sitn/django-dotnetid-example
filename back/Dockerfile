FROM python:3.13-bookworm
LABEL maintainer SITN "sitn@ne.ch"

RUN apt update \
    && apt install --assume-yes git libgdal-dev \
    && pip install --upgrade pip \
    && pip install gunicorn

COPY ./requirements.txt /app/django-dotnetid-example/requirements.txt
WORKDIR /app/django-dotnetid-example/
RUN pip install -r requirements.txt

COPY . /app/django-dotnetid-example/
