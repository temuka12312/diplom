from django.urls import path
from . import views
from ai_engine import views as ai_views

urlpatterns = [
    path("test/", views.test, name="api-test"),
    path("ai/lessons/<int:lesson_id>/summary/", ai_views.lesson_summary),
    path("ai/lessons/<int:lesson_id>/quiz/", ai_views.lesson_quiz),
    path("ai/recommendations/", ai_views.recommended_lessons),  
]