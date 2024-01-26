from allauth.socialaccount.providers.openid_connect.views import OpenIDConnectAdapter
from allauth.socialaccount.providers.oauth2.views import (
    OAuth2CallbackView,
    OAuth2LoginView,
)
from .provider import DotnetIdProvider

class DotnetIdAdapter(OpenIDConnectAdapter):
    provider_id = DotnetIdProvider.id


def login(request, provider_id):
    view = OAuth2LoginView.adapter_view(DotnetIdAdapter(request, provider_id))
    return view(request)


def callback(request, provider_id):
    view = OAuth2CallbackView.adapter_view(DotnetIdAdapter(request, provider_id))
    return view(request)

