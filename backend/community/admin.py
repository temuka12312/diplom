from django.contrib import admin
from .models import CommunityPost, CommunityComment


@admin.register(CommunityPost)
class CommunityPostAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "author",
        "title",
        "lesson",
        "moderation_status",
        "created_at",
    )
    list_filter = ("moderation_status", "lesson", "created_at")
    search_fields = ("author__username", "title", "content", "moderation_reason")


@admin.register(CommunityComment)
class CommunityCommentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "author",
        "post",
        "moderation_status",
        "created_at",
    )
    list_filter = ("moderation_status", "created_at")
    search_fields = ("author__username", "content", "moderation_reason")