from rest_framework import serializers
from .models import LessonProgress


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ("id", "lesson", "is_completed", "score", "completed_at")
        read_only_fields = ("id", "completed_at")