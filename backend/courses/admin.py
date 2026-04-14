from django.contrib import admin
from .models import Course, Lesson, LearningTrack


@admin.register(LearningTrack)
class LearningTrackAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order")
    prepopulated_fields = {"slug": ("name",)}


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "track", "level", "created_by", "created_at")
    list_filter = ("track", "level")
    search_fields = ("title", "description")
    inlines = [LessonInline]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "track",
                    "title",
                    "description",
                    "thumbnail",
                    "level",
                    "created_by",
                )
            },
        ),
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order", "score")
    list_filter = ("course",)
    search_fields = ("title", "content")
