from rest_framework import serializers
from .models import CommunityPost, CommunityComment


class CommunityCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = CommunityComment
        fields = (
            "id",
            "post",
            "author",
            "author_username",
            "content",
            "moderation_status",
            "moderation_reason",
            "created_at",
        )
        read_only_fields = (
            "id",
            "author",
            "author_username",
            "moderation_status",
            "moderation_reason",
            "created_at",
        )


class CommunityPostSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)
    comments = CommunityCommentSerializer(many=True, read_only=True)

    class Meta:
        model = CommunityPost
        fields = (
            "id",
            "author",
            "author_username",
            "title",
            "content",
            "lesson",
            "moderation_status",
            "moderation_reason",
            "created_at",
            "comments",
        )
        read_only_fields = (
            "id",
            "author",
            "author_username",
            "moderation_status",
            "moderation_reason",
            "created_at",
            "comments",
        )