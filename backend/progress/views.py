from django.utils import timezone
from django.db import models

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import LessonProgress
from courses.models import Lesson
from .serializers import LessonProgressSerializer

from django.db.models import Count, Sum, Q
from django.db.models.functions import Coalesce

from courses.models import Course, Lesson
from .models import LessonProgress
from users.models import User 


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def lesson_progress_detail(request, lesson_id):
    """
    Нэг lesson-ийн явц (progress) буцаана.
    Хэрвээ байхгүй бол user+lesson хослол дээр шинээр Progress үүсгээд буцаана.
    """
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"detail": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    progress, created = LessonProgress.objects.get_or_create(
        user=request.user,
        lesson=lesson,
    )

    serializer = LessonProgressSerializer(progress)
    return Response(serializer.data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_lesson(request, lesson_id):
    try:
        lesson = Lesson.objects.get(pk=lesson_id)
    except Lesson.DoesNotExist:
        return Response({"detail": "Lesson not found"}, status=status.HTTP_404_NOT_FOUND)

    progress, created = LessonProgress.objects.get_or_create(
        user=request.user,
        lesson=lesson,
    )

    score = lesson.score or 0

    progress.is_completed = True
    progress.score = score
    progress.completed_at = timezone.now()
    progress.save()

    user = request.user

    user.completed_lessons = LessonProgress.objects.filter(
        user=user,
        is_completed=True,
    ).count()

    agg = LessonProgress.objects.filter(user=user).aggregate(
        total=models.Sum("score")
    )
    user.total_score = agg["total"] or 0

    user.update_level_and_role()

    user.save(update_fields=["completed_lessons", "total_score", "skill_level", "role"])

    serializer = LessonProgressSerializer(progress)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def progress_summary(request):
    user = request.user

    data = {
        "username": user.username,
        "email": user.email,
        "role": getattr(user, "role", None),
        "skill_level": getattr(user, "skill_level", None),
        "total_score": getattr(user, "total_score", 0),
        "completed_lessons": getattr(user, "completed_lessons", 0),
    }

    courses = []
    for course in Course.objects.all():
        total = course.lessons.count()
        completed = LessonProgress.objects.filter(
            user=user, lesson__course=course, is_completed=True
        ).count()

        percent = 0
        if total > 0:
            percent = round(completed / total * 100, 2)

        courses.append(
            {
                "course_id": course.id,
                "course_title": course.title,
                "total_lessons": total,
                "completed_lessons": completed,
                "progress_percent": percent,
            }
        )

    data["courses"] = courses

    return Response(data)