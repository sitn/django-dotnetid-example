# OpenID BFF with Django

A simple Django project with openid working with dotnetaccess

## Requirements

* openssl in order to generate certificates. Easier to use WSL if you're on Windows.

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

Backend should work. Authentication on backend should also work.

⚠ Do not change docker port on local, the only allowed host registered on OpenID is `http://127.0.0.1:8000`

### Frontend and BFF

We want a frontend to access secured backend endpoints. On a separate terminal, run the frontend

```sh
cd front
npm run start
```

Now, we need a proxy for two reasons:
1. Avoid cross domain cookies (possible but needs extra config)
2. HTTPS endpoints

In a new terminal (a wsl one if you're on windows), generate the certificates:

```sh
openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout apache/certs/server.key \
  -out apache/certs/server.crt \
  -subj "/CN=localhost"
```

Two files should appear in `apache/certs` folder.

Now you can run apache in a new terminal:

```sh
docker compose up -d apache
```

Go to https://localhost

Login should work.

### Deploy

In progress...
<!--
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
-->