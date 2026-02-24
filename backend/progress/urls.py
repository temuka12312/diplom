from django.urls import path
from . import views

urlpatterns = [
    path("lessons/<int:lesson_id>/", views.lesson_progress_detail, name="lesson-progress-detail"),
    path("lessons/<int:lesson_id>/complete/", views.complete_lesson, name="complete-lesson"),
    path("summary/", views.progress_summary),
]