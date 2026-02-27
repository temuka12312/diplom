from rest_framework import serializers
from .models import Course, Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = (
            "id",
            "course",
            "title",
            "content",
            "order",
            "video_url",
            "file",        # ← PDF
            "attachment",  # ← PPT/DOCX/ZIP г.м
            "score",
        )


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = (
            "id",
            "title",
            "description",
            "level",
            "lessons",
        )