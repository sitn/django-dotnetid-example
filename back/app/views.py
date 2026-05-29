import logging

from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie

LOGGER = logging.getLogger(__name__)

def index(request):
    """
    Vue pur backend, inutile au BFF
    """
    LOGGER.info(f'INDEX has been accessed with user: {request.user}')
    return render(request, 'index.html')

@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({"success": True})

def get_user(request):
    if request.user.username:
        return JsonResponse({
            "username": request.user.username,
        })
    return HttpResponse('Unauthorized', status=401)