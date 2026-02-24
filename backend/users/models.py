from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ("student", "Student"),
        ("mentor", "Mentor"),  
        ("admin", "Admin"),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="student")

    skill_level = models.CharField(
        max_length=20,
        choices=(
            ("beginner", "Beginner"),
            ("intermediate", "Intermediate"),
            ("advanced", "Advanced"),
        ),
        default="beginner",
    )

    total_score = models.FloatField(default=0)
    completed_lessons = models.IntegerField(default=0)

    def update_level_and_role(self):
        """
        total_score + completed_lessons дээр үндэслээд
        skill_level, role хоёрыг автоматаар шинэчилнэ.
        """
        score = self.total_score

        if score < 100:
            level = "beginner"
        elif score < 300:
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