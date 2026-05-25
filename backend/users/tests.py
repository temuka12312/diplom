from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User


class SaveLevelTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="student",
            password="secret123",
            has_placement_test=False,
        )
        self.client.force_authenticate(self.user)

    def test_allows_manual_beginner_selection(self):
        response = self.client.post("/api/auth/save-level/", {"level": "beginner"}, format="json")

        self.user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(self.user.skill_level, "beginner")
        self.assertTrue(self.user.has_placement_test)

    def test_rejects_manual_advanced_selection(self):
        response = self.client.post("/api/auth/save-level/", {"level": "advanced"}, format="json")

        self.user.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(self.user.has_placement_test)
