FROM osgeo/gdal:ubuntu-small-3.6.3
LABEL maintainer SITN "sitn@ne.ch"

RUN apt-get update \
    && apt-get upgrade --assume-yes \
    && apt-get install git --assume-yes \
    && DEBIAN_FRONTEND=noninteractive apt-get install --assume-yes --no-install-recommends python3-pip \
    && pip install --upgrade pip \
    && pip install gunicorn

COPY ./requirements.txt /app/django-dotnetid-example/requirements.txt
WORKDIR /app/django-dotnetid-example/
RUN pip3 install -r requirements.txt

ENV PYTHONUNBUFFERED 1

COPY ./src /app/django-dotnetid-example/
COPY .env /app/django-dotnetid-example/.env
