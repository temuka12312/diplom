from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    LessonDetailView,
    LessonListCreateView,
    LearningTrackListView,
    TrackCourseListView,
)

urlpatterns = [
    path("", CourseListView.as_view(), name="courses"),
    path("tracks/", LearningTrackListView.as_view(), name="tracks"),
    path("tracks/<int:track_id>/", TrackCourseListView.as_view(), name="track-courses"),
    path("<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    path("lessons/<int:pk>/", LessonDetailView.as_view(), name="lesson-detail"),
    path("lessons/", LessonListCreateView.as_view(), name="lessons"),
]