from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='student')

    # AI-д хэрэгтэй талбарууд
    skill_level = models.CharField(
        max_length=20,
        choices=(
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
        ),
        default='beginner'
    )

    total_score = models.FloatField(default=0)
    completed_lessons = models.IntegerField(default=0)

    def __str__(self):
        return self.username
