from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from courses.models import Course, Lesson
from users.models import User


class SubmitPracticeTaskTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="tester", password="secret123")
        self.client.force_authenticate(self.user)
        self.course = Course.objects.create(
            title="Git Basics",
            description="Git command and workflow basics.",
            level="beginner",
        )

    def test_rejects_too_short_practice_answer(self):
        lesson = Lesson.objects.create(
            course=self.course,
            title="Git init",
            content="git init creates a new repository.",
            practice_title="Repo create",
            practice_description="Write the command to create a new git repository.",
            practice_expected_output="git init",
        )

        response = self.client.post(
            reverse("submit-practice-task", kwargs={"lesson_id": lesson.id}),
            {"answer": "test"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["accepted"])
        self.assertFalse(response.data["progress"]["practice_submitted"])

    def test_accepts_matching_expected_output(self):
        lesson = Lesson.objects.create(
            course=self.course,
            title="Git init",
            content="git init creates a new repository.",
            practice_title="Repo create",
            practice_description="Write the command to create a new git repository.",
            practice_expected_output="git init",
        )

        response = self.client.post(
            reverse("submit-practice-task", kwargs={"lesson_id": lesson.id}),
            {"answer": "The correct command is git init"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["accepted"])
        self.assertTrue(response.data["progress"]["practice_submitted"])

    def test_generates_and_persists_practice_task_when_missing(self):
        lesson = Lesson.objects.create(
            course=self.course,
            title="Git status",
            content="git status shows changed files in the working tree.",
        )

        response = self.client.post(
            reverse("submit-practice-task", kwargs={"lesson_id": lesson.id}),
            {"answer": "git status shows tracked and modified files in the repository."},
            format="json",
        )

        lesson.refresh_from_db()

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(bool(lesson.practice_title.strip()))
        self.assertTrue(bool(lesson.practice_description.strip()))
