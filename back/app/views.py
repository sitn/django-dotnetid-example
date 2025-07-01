from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required

import logging

LOGGER = logging.getLogger(__name__)

def index(request):
    LOGGER.info(f'INDEX has been accessed with user: {request.user}')
    return render(request, 'index.html')

def get_user(request):
    if request.user.username:
        return JsonResponse({
            "username": request.user.username,
        })
    return HttpResponse('Unauthorized', status=401)