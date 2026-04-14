from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    LessonDetailView,
    LessonListCreateView,
    LearningTrackListView,
    TrackCourseListView,
    LikedLessonListView,
    toggle_lesson_like,
    home_feed,
    search_catalog,
)

urlpatterns = [
    path("", CourseListView.as_view(), name="courses"),
    path("home-feed/", home_feed, name="home-feed"),
    path("search/", search_catalog, name="search-catalog"),
    path("tracks/", LearningTrackListView.as_view(), name="tracks"),
    path("tracks/<int:track_id>/", TrackCourseListView.as_view(), name="track-courses"),
    path("liked-lessons/", LikedLessonListView.as_view(), name="liked-lessons"),
    path("lessons/<int:lesson_id>/toggle-like/", toggle_lesson_like, name="toggle-lesson-like"),
    path("<int:pk>/", CourseDetailView.as_view(), name="course-detail"),
    path("lessons/<int:pk>/", LessonDetailView.as_view(), name="lesson-detail"),
    path("lessons/", LessonListCreateView.as_view(), name="lessons"),
]
