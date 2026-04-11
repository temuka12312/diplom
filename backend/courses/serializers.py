from rest_framework import serializers
from .models import Course, Lesson, LearningTrack


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    track_name = serializers.CharField(source="track.name", read_only=True)
    track_slug = serializers.CharField(source="track.slug", read_only=True)

    class Meta:
        model = Course
        fields = "__all__"


class LearningTrackSerializer(serializers.ModelSerializer):
    courses_count = serializers.IntegerField(source="courses.count", read_only=True)

    class Meta:
        model = LearningTrack
        fields = ("id", "name", "description", "slug", "icon", "order", "courses_count")