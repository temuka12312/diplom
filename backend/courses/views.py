from django.db.models import Count, Q
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated
from rest_framework.response import Response

from .models import Course, Lesson, LearningTrack, LikedLesson
from .serializers import (
    CourseSerializer,
    LessonSerializer,
    LearningTrackSerializer,
    LikedLessonSerializer,
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


class LikedLessonListView(generics.ListAPIView):
    serializer_class = LikedLessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            LikedLesson.objects.filter(user=self.request.user)
            .select_related("lesson", "lesson__course")
            .order_by("-created_at")
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_lesson_like(request, lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response(
            {"detail": "Lesson not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    liked = LikedLesson.objects.filter(user=request.user, lesson=lesson).first()

    if liked:
        liked.delete()
        return Response({"liked": False}, status=status.HTTP_200_OK)

    LikedLesson.objects.create(user=request.user, lesson=lesson)
    return Response({"liked": True}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def home_feed(request):
    user_level = getattr(request.user, "skill_level", "beginner") or "beginner"
    user_rank = LEVEL_RANK.get(user_level, 1)
    allowed_levels = [
        level_name
        for level_name, rank in LEVEL_RANK.items()
        if rank <= user_rank
    ]

    annotated_courses = list(
        Course.objects.filter(level__in=allowed_levels, track__isnull=False)
        .select_related("track")
        .prefetch_related("lessons")
        .annotate(
            lesson_count=Count("lessons", distinct=True),
            learner_count=Count(
                "lessons__progress__user",
                filter=Q(lessons__progress__is_completed=True),
                distinct=True,
            ),
            liked_count=Count("lessons__liked_by_users", distinct=True),
        )
        .order_by("-learner_count", "-liked_count", "-created_at")
    )

    top_courses = annotated_courses[:8]
    top_courses_data = CourseSerializer(
        top_courses,
        many=True,
        context={"request": request},
    ).data

    track_sections = []
    for track in LearningTrack.objects.all().order_by("order", "name"):
        track_courses = [course for course in annotated_courses if course.track_id == track.id][:6]
        if not track_courses:
            continue

        track_sections.append(
            {
                "id": track.id,
                "name": track.name,
                "slug": track.slug,
                "description": track.description,
                "courses": CourseSerializer(
                    track_courses,
                    many=True,
                    context={"request": request},
                ).data,
            }
        )

    return Response(
        {
            "user_level": user_level,
            "featured_courses": top_courses_data,
            "track_sections": track_sections,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search_catalog(request):
    query = (request.query_params.get("q") or "").strip()
    if len(query) < 2:
        return Response({"tracks": [], "courses": [], "lessons": []})

    tracks = LearningTrack.objects.filter(name__icontains=query).order_by("order", "name")[:5]
    courses = (
        Course.objects.filter(Q(title__icontains=query) | Q(description__icontains=query))
        .select_related("track")
        .order_by("-created_at")[:6]
    )
    lessons = (
        Lesson.objects.filter(Q(title__icontains=query) | Q(content__icontains=query))
        .select_related("course")
        .order_by("title")[:6]
    )

    return Response(
        {
            "tracks": [
                {
                    "id": track.id,
                    "name": track.name,
                    "slug": track.slug,
                    "type": "track",
                }
                for track in tracks
            ],
            "courses": [
                {
                    "id": course.id,
                    "title": course.title,
                    "track_name": getattr(course.track, "name", ""),
                    "type": "course",
                }
                for course in courses
            ],
            "lessons": [
                {
                    "id": lesson.id,
                    "title": lesson.title,
                    "course_id": lesson.course_id,
                    "course_title": lesson.course.title,
                    "type": "lesson",
                }
                for lesson in lessons
            ],
        }
    )
