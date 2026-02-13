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

from rest_framework import generics
from users.models import User
from users.serializers import RegisterSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
