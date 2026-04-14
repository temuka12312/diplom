from django.contrib.auth.models import AbstractUser
from django.db import models


SKILL_LEVEL_CHOICES = (
    ("beginner", "Анхан"),
    ("elementary", "Суурь"),
    ("intermediate", "Дунд"),
    ("advanced", "Ахисан"),
)


class User(AbstractUser):
    ROLE_CHOICES = (
        ("student", "Student"),
        ("mentor", "Mentor"),
        ("admin", "Admin"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")
    display_name = models.CharField(max_length=120, blank=True, default="")
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    skill_level = models.CharField(
        max_length=20,
        choices=SKILL_LEVEL_CHOICES,
        default="beginner",
        blank=True,
        null=True,
    )

    has_placement_test = models.BooleanField(default=False)

    total_score = models.FloatField(default=0)
    completed_lessons = models.IntegerField(default=0)

    warning_count = models.IntegerField(default=0)

    def add_warning(self):
        self.warning_count += 1
        self.save(update_fields=["warning_count"])

    def update_level_and_role(self):
        score = self.total_score

        if score < 100:
            level = "beginner"
        elif score < 200:
            level = "elementary"
        elif score < 400:
            level = "intermediate"
        else:
            level = "advanced"

        self.skill_level = level

        if level == "advanced" and self.completed_lessons >= 5:
            if self.role != "admin":
                self.role = "mentor"
        else:
            if self.role == "mentor":
                self.role = "student"

        self.save(update_fields=["skill_level", "role"])

    def __str__(self):
        return self.username
