from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    LessonDetailView,
    LessonListCreateView,  # ← ШИНЭ
)

urlpatterns = [
    path("", CourseListView.as_view(), name="course-list"),
    path("<int:pk>/", CourseDetailView.as_view(), name="course-detail"),

    # хичээлүүдийн list + create (POST: видео/PDF upload)
    path("lessons/", LessonListCreateView.as_view(), name="lesson-list-create"),

    # ганц хичээлийн дэлгэрэнгүй
    path("lessons/<int:pk>/", LessonDetailView.as_view(), name="lesson-detail"),
]