from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import register, me, save_level, update_profile, change_password

urlpatterns = [
    path("register/", register),
    path("login/", TokenObtainPairView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("me/", me),
    path("save-level/", save_level),
    path("profile/", update_profile),
    path("change-password/", change_password),
]
