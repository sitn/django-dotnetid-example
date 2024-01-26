# OpenID with Django

A simple django project with openid working with dotnetaccess

## Local test

```sh
cd src
cp .env.sample .env
```

Then adapt the `.env` file

```sh
python -m venv venv
./venv/Scripts/activate
pip install -r requirements.txt
cd src
python manage.py runserver
```

Go to http://127.0.0.1:8000
