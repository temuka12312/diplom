from django.db import models
from django.conf import settings
from courses.models import Lesson

User = settings.AUTH_USER_MODEL


class LessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="progress")
    is_completed = models.BooleanField(default=False)
    score = models.FloatField(default=0)
    practice_answer = models.TextField(blank=True, default="")
    practice_submitted = models.BooleanField(default=False)
    practice_feedback = models.TextField(blank=True, default="")
    practice_submitted_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "lesson")

    def __str__(self):
        return f"{self.user} - {self.lesson} ({'done' if self.is_completed else 'pending'})"
