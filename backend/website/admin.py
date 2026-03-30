from django.contrib import admin
from .models import LandingPageContent


@admin.register(LandingPageContent)
class LandingPageContentAdmin(admin.ModelAdmin):
    list_display = ("site_name", "hero_title", "updated_at")