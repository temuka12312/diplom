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

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer, UserSerializer
from .models import User


@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User created"}, status=201)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
