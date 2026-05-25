from unittest.mock import patch

from rest_framework.test import APITestCase

from courses.models import Course, Lesson
from users.models import User

from .views import get_level_from_percent, get_next_skill_level


class LevelUpQuizTests(APITestCase):
    def test_get_next_skill_level_includes_elementary_step(self):
        self.assertEqual(get_next_skill_level("beginner"), "elementary")
        self.assertEqual(get_next_skill_level("elementary"), "intermediate")
        self.assertEqual(get_next_skill_level("intermediate"), "advanced")
        self.assertIsNone(get_next_skill_level("advanced"))

    @patch.dict("os.environ", {}, clear=True)
    def test_level_up_quiz_works_for_elementary_without_gemini_key(self):
        user = User.objects.create_user(
            username="student",
            password="pass1234",
            skill_level="elementary",
            has_placement_test=True,
        )
        course = Course.objects.create(
            title="HTML Foundations",
            description="Web basics",
            level="elementary",
        )
        Lesson.objects.create(
            course=course,
            title="Semantic HTML",
            content="HTML tag structure and layout basics.",
            order=1,
        )

        self.client.force_authenticate(user=user)
        response = self.client.get("/api/ai/level-up-test/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["current_level"], "elementary")
        self.assertEqual(response.data["next_level"], "intermediate")
        self.assertEqual(len(response.data["questions"]), 10)
        self.assertIn("level_up_questions", self.client.session)


class PlacementLevelTests(APITestCase):
    def test_percent_to_level_supports_four_tiers(self):
        self.assertEqual(get_level_from_percent(10), "beginner")
        self.assertEqual(get_level_from_percent(25), "elementary")
        self.assertEqual(get_level_from_percent(50), "intermediate")
        self.assertEqual(get_level_from_percent(75), "advanced")
