from django.urls import path
from .views import ( lesson_summary,lesson_quiz,recommended_lessons,placement_quiz,level_up_quiz,)

urlpatterns = [
    path("lessons/<int:lesson_id>/summary/", lesson_summary),
    path("lessons/<int:lesson_id>/quiz/", lesson_quiz),
    path("recommendations/", recommended_lessons),
    path("placement-test/", placement_quiz),
    path("level-up-test/", level_up_quiz),
]