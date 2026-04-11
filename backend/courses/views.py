from rest_framework import generics
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from .models import Course, Lesson, LearningTrack
from .serializers import (
    CourseSerializer,
    LessonSerializer,
    LearningTrackSerializer,
)
from ai_engine.views import ensure_practice_task_for_lesson


LEVEL_RANK = {
    "beginner": 1,
    "elementary": 2,
    "intermediate": 3,
    "advanced": 4,
}


class IsStaffMentorOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)

        user = request.user
        return bool(
            user
            and user.is_authenticated
            and (
                user.is_staff
                or user.is_superuser
                or getattr(user, "role", None) in {"admin", "mentor"}
            )
        )


class LearningTrackListView(generics.ListAPIView):
    queryset = LearningTrack.objects.all().order_by("order", "name")
    serializer_class = LearningTrackSerializer
    permission_classes = [IsAuthenticated]


class TrackCourseListView(generics.ListAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        track_id = self.kwargs.get("track_id")
        return (
            Course.objects.filter(track_id=track_id)
            .select_related("track")
            .prefetch_related("lessons")
            .order_by("-created_at")
        )


class CourseListView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsStaffMentorOrReadOnly]

    def get_queryset(self):
        qs = (
            Course.objects.all()
            .select_related("track")
            .prefetch_related("lessons")
            .order_by("-created_at")
        )

        level = self.request.query_params.get("level")
        my_level_only = self.request.query_params.get("my_level")
        track_id = self.request.query_params.get("track")

        if track_id:
            qs = qs.filter(track_id=track_id)

        if my_level_only == "1":
            user_level = getattr(self.request.user, "skill_level", "beginner")
            user_rank = LEVEL_RANK.get(user_level, 1)

            allowed_levels = [
                level_name
                for level_name, rank in LEVEL_RANK.items()
                if rank <= user_rank
            ]
            qs = qs.filter(level__in=allowed_levels)

        elif level in LEVEL_RANK:
            qs = qs.filter(level=level)

        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CourseDetailView(generics.RetrieveAPIView):
    queryset = (
        Course.objects.all()
        .select_related("track")
        .prefetch_related("lessons")
    )
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.all().select_related("course")
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        lesson = super().get_object()
        lesson = ensure_practice_task_for_lesson(lesson)
        return lesson


class LessonListCreateView(generics.ListCreateAPIView):
    serializer_class = LessonSerializer
    permission_classes = [IsStaffMentorOrReadOnly]

    def get_queryset(self):
        qs = (
            Lesson.objects.all()
            .select_related("course")
            .order_by("order")
        )

        course_id = self.request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)

        return qs

    def perform_create(self, serializer):
        serializer.save()
