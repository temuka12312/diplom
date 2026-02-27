"""
URL configuration for elearn project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse  
from django.conf import settings
from django.conf.urls.static import static


def home(request):
    return HttpResponse("Welcome to Elearn API!")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/", include("api.urls")),
    path("api/progress/", include("progress.urls")),
    path("api/courses/", include("courses.urls")),
    path("", home),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)