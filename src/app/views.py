from django.shortcuts import render
import logging

LOGGER = logging.getLogger(__name__)

def index(request):
    LOGGER.info(f'INDEX has been accessed with user: {request.user}')
    return render(request, 'index.html')
