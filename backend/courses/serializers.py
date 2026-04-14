from rest_framework import serializers
from .models import Course, Lesson, LearningTrack, LikedLesson


class LessonSerializer(serializers.ModelSerializer):
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = "__all__"

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return False

        return LikedLesson.objects.filter(user=request.user, lesson=obj).exists()


class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    track_name = serializers.CharField(source="track.name", read_only=True)
    track_slug = serializers.CharField(source="track.slug", read_only=True)
    lesson_count = serializers.IntegerField(read_only=True, required=False)
    learner_count = serializers.IntegerField(read_only=True, required=False)
    liked_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Course
        fields = (
            "id",
            "title",
            "description",
            "thumbnail",
            "level",
            "track",
            "track_name",
            "track_slug",
            "created_by",
            "created_at",
            "lessons",
            "lesson_count",
            "learner_count",
            "liked_count",
        )


class LearningTrackSerializer(serializers.ModelSerializer):
    courses_count = serializers.IntegerField(source="courses.count", read_only=True)

    class Meta:
        model = LearningTrack
        fields = ("id", "name", "description", "slug", "icon", "order", "courses_count")


class LikedLessonSerializer(serializers.ModelSerializer):
    lesson = LessonSerializer(read_only=True)
    course_id = serializers.IntegerField(source="lesson.course.id", read_only=True)
    course_title = serializers.CharField(source="lesson.course.title", read_only=True)

    class Meta:
        model = LikedLesson
        fields = ("id", "lesson", "course_id", "course_title", "created_at")
