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
cd src
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

