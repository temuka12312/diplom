from django.db import models
from django.conf import settings
from django.core.validators import FileExtensionValidator

LEVEL_CHOICES = (
    ("beginner", "Анхан"),
    ("elementary", "Суурь"),
    ("intermediate", "Дунд"),
    ("advanced", "Ахисан"),
)


class LearningTrack(models.Model):
    name = models.CharField(max_length=120, unique=True)
    description = models.TextField(blank=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, default="FaBookOpen")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Course(models.Model):
    track = models.ForeignKey(
        LearningTrack,
        on_delete=models.CASCADE,
        related_name="courses",
        null=True,
        blank=True,
    )
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
        related_name="lessons",
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    content = models.TextField(blank=True)

    video_url = models.URLField(blank=True)

    video_file = models.FileField(
        upload_to="lessons/videos/",
        null=True,
        blank=True,
        validators=[FileExtensionValidator(["mp4", "mov", "avi", "mkv"])],
    )

    file = models.FileField(
        upload_to="lessons/files/",
        null=True,
        blank=True,
        validators=[FileExtensionValidator(["pdf"])],
    )

    attachment = models.FileField(
        upload_to="lessons/attachments/",
        null=True,
        blank=True,
    )

    order = models.PositiveIntegerField(default=0)
    score = models.PositiveIntegerField(default=10)

    practice_title = models.CharField(max_length=255, blank=True, default="")
    practice_description = models.TextField(blank=True, default="")
    practice_hint = models.TextField(blank=True, default="")
    practice_expected_output = models.TextField(blank=True, default="")
    practice_bonus_score = models.PositiveIntegerField(default=5)

    def __str__(self):
        return self.title