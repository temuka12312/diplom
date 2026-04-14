from django.contrib import admin
from .models import LandingPageContent, LandingPageReview


@admin.register(LandingPageContent)
class LandingPageContentAdmin(admin.ModelAdmin):
    list_display = ("site_name", "hero_title", "updated_at")


@admin.register(LandingPageReview)
class LandingPageReviewAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "company", "rating", "sort_order", "is_active")
    list_filter = ("is_active", "rating")
    search_fields = ("name", "role", "company", "review_text")
    list_editable = ("sort_order", "is_active")
