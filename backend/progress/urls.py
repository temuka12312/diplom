from django.urls import path
from . import views

urlpatterns = [
    path("lessons/<int:lesson_id>/", views.lesson_progress_detail, name="lesson-progress-detail"),
    path("lessons/<int:lesson_id>/complete/", views.complete_lesson, name="complete-lesson"),
    path("lessons/<int:lesson_id>/submit-practice/", views.submit_practice_task, name="submit-practice-task"),
    path("summary/", views.progress_summary),
]
