from django.db import models
from django.conf import settings

LEVEL_CHOICES = (
    ("beginner", "Beginner"),
    ("intermediate", "Intermediate"),
    ("advanced", "Advanced"),
)


class Course(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    level = models.CharField(
        max_length=20,
        choices=LEVEL_CHOICES,
        default="beginner",
    )
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="courses",
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)

    def __str__(self):
        return self.title


class Lesson(models.Model):
    course = models.ForeignKey(
        Course,
        on_delete=models.CASCADE,
        related_name="lessons",
    )
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    order = models.IntegerField(default=1)
    # ⬇️ ШИНЭ ТАЛБАР: видео хаяг (YouTube, Vimeo, mp4 линк г.м)
    video_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.course.title} - {self.title}"