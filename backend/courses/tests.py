from rest_framework import status
from rest_framework.test import APITestCase

from courses.models import Course, LearningTrack, Lesson
from users.models import User


class CourseAccessTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="student",
            password="secret123",
            skill_level="beginner",
            has_placement_test=True,
        )
        self.client.force_authenticate(self.user)

        self.track = LearningTrack.objects.create(
            name="Web",
            slug="web",
        )
        self.beginner_course = Course.objects.create(
            title="HTML Basics",
            level="beginner",
            track=self.track,
        )
        self.advanced_course = Course.objects.create(
            title="Advanced Django",
            level="advanced",
            track=self.track,
        )
        self.beginner_lesson = Lesson.objects.create(
            course=self.beginner_course,
            title="Intro",
            content="Basic tags",
            order=1,
        )
        self.advanced_lesson = Lesson.objects.create(
            course=self.advanced_course,
            title="ORM tuning",
            content="Query planning",
            order=1,
        )

    def test_track_courses_only_include_allowed_levels(self):
        response = self.client.get(f"/api/courses/tracks/{self.track.id}/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["id"], self.beginner_course.id)

    def test_course_detail_blocks_higher_level_course(self):
        response = self.client.get(f"/api/courses/{self.advanced_course.id}/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_lesson_detail_blocks_higher_level_lesson(self):
        response = self.client.get(f"/api/courses/lessons/{self.advanced_lesson.id}/")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_search_hides_higher_level_content(self):
        response = self.client.get("/api/courses/search/", {"q": "Django"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["courses"], [])
        self.assertEqual(response.data["lessons"], [])


class CourseRecommendationTests(APITestCase):
    def test_recommendations_filter_elementary_level_exactly(self):
        user = User.objects.create_user(
            username="elementary",
            password="secret123",
            skill_level="elementary",
            has_placement_test=True,
        )
        elementary_course = Course.objects.create(
            title="CSS Layout",
            level="elementary",
        )
        advanced_course = Course.objects.create(
            title="Scaling APIs",
            level="advanced",
        )
        Lesson.objects.create(
            course=elementary_course,
            title="Flexbox",
            content="Layout foundations",
            order=1,
        )
        Lesson.objects.create(
            course=advanced_course,
            title="Caching",
            content="Redis strategies",
            order=1,
        )

        self.client.force_authenticate(user)
        response = self.client.get("/api/ai/recommendations/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["level"], "elementary")
