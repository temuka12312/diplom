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


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def save_level(request):
    """
    Placement test-ийн онооны дагуу хэрэглэгчийн skill_level-ийг хадгална.
    has_placement_test = True болгож, дараа нь дахиж шалгалт нэхэхгүй.
    """
    level = request.data.get("level")
    user: User = request.user

    valid_levels = ["beginner", "intermediate", "advanced"]
    if level not in valid_levels:
        return Response({"detail": "Invalid level"}, status=400)

    user.skill_level = level
    user.has_placement_test = True
    user.save(update_fields=["skill_level", "has_placement_test"])

    return Response(
        {
            "username": user.username,
            "skill_level": user.skill_level,
            "has_placement_test": user.has_placement_test,
        },
        status=200,
    )