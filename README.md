# OpenID with Django

A simple django project with openid working with dotnetaccess

## Local test

```sh
cp .env.sample .env
```

Then adapt the `.env` file

```sh
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
cd back
python manage.py migrate
python manage.py runserver
```

Go to http://127.0.0.1:8000


### Local with Docker

```sh
docker compose up -d --build
```

Go to http://127.0.0.1:8000

⚠ Do not change docker port on local, the only allowed host registered on OpenID is `http://127.0.0.1:8000`


### Deploy

Set your `DOCKER_HOST` env.

Change .env accordingly, then:

```sh
docker compose up -d --build
```

If you're behind a proxy, add this to your apache conf:

```conf
<Location /apps/>
  RequestHeader set X-Forwarded-Host "visible-host.example.com"
  RequestHeader set X-Forwarded-Proto "https"
  RequestHeader unset Host
</Location>
ProxyPass "/apps/" "http://runner.example.com:DOCKER_PORT/"
ProxyPassReverse "/apps/"  "http://runner.example.com:DOCKER_PORT/"
```
