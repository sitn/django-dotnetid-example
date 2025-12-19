import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
FORCE_SCRIPT_NAME = os.environ.get('ROOTURL', '')


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-wf1a$x1=)e7!5!&sye*%9ey*ythbms#z11oieo5lpdrnjeaanw"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False
if os.environ.get("DEBUG", False) == "True":
    DEBUG = True

ALLOWED_HOSTS = os.environ["ALLOWED_HOSTS"].split(",")
CSRF_TRUSTED_ORIGINS = os.environ["CORS_ALLOWED_ORIGINS"].split(",")
CORS_ORIGIN_WHITELIST = os.environ["CORS_ALLOWED_ORIGINS"].split(",")
CORS_ALLOW_CREDENTIALS = True


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "django_dotnetid",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.openid_connect",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

ROOT_URLCONF = "app.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": ["app/templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "app.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}


AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

SOCIALACCOUNT_PROVIDERS = {
    "dotnetidprovider": {
        "APP": {
            "provider_id": "dotnetid",
            "name": "Etat de Neuchâtel",
            "client_id": os.environ['DOTNETID_CLIENT_ID'],
            "secret": os.environ['DOTNETID_CLIENT_SECRET'],
            "settings": {
                "server_url": os.environ['DOTNETID_SERVER_URL'],
            },
        },
        "SCOPE": [
            "profile",
            "openid",
            "glados",
        ],
        "EXTRA_ATTRIBUTES_PREFIX": "djangoopenid",
        "EXTRA_ATTRIBUTES_NAMES": [
            "groups",
            "admin",
        ],
        "OAUTH_PKCE_ENABLED": True,
        "ID_TOKEN_ISSUER": os.environ['DOTNETID_SERVER_URL'],
    }
}
SOCIALACCOUNT_EMAIL_VERIFICATION = None
SOCIALACCOUNT_ADAPTER  = 'django_dotnetid.adapter.DotnetIdAccountAdapter'
LOGIN_REDIRECT_URL = 'index'
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_LOGOUT_REDIRECT = 'index'
SITE_ID = 1

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = "fr-CH"

TIME_ZONE = "Europe/Zurich"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}
