from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        "username",
        "display_name",
        "email",
        "role",
        "skill_level",
        "warning_count",
        "total_score",
        "completed_lessons",
        "is_staff",
    )

    list_filter = (
        "role",
        "skill_level",
        "is_staff",
        "is_superuser",
        "is_active",
    )

    fieldsets = UserAdmin.fieldsets + (
        (
            "Learning Info",
            {
                "fields": (
                    "display_name",
                    "avatar",
                    "role",
                    "skill_level",
                    "has_placement_test",
                    "total_score",
                    "completed_lessons",
                    "warning_count",
                )
            },
        ),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (
            "Learning Info",
            {
                "fields": (
                    "display_name",
                    "avatar",
                    "role",
                    "skill_level",
                    "has_placement_test",
                    "total_score",
                    "completed_lessons",
                    "warning_count",
                )
            },
        ),
    )
