from django.shortcuts import render
import os
import json
import logging

from django.http import JsonResponse

from django.views.generic import TemplateView
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import login
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password

from users.models import User
# Create your views here.

def ping(request):
    data = {}
    data['build_mode'] = os.environ.get("BUILD_MODE")
    data['build_date'] = os.environ.get("BUILD_DATE")
    data['version'] = os.environ.get("IMAGE_VERSION")
    data['app'] = "core"
    return JsonResponse(data)

logger = logging.getLogger(__name__)