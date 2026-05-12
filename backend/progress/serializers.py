from rest_framework import serializers
from .models import LessonProgress


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = (
            "id",
            "lesson",
            "is_completed",
            "score",
            "practice_answer",
            "practice_submitted",
            "practice_feedback",
            "practice_submitted_at",
            "completed_at",
        )
        read_only_fields = ("id", "completed_at", "practice_submitted_at")
