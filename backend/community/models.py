from django.conf import settings
from django.db import models
from courses.models import Lesson


MODERATION_CHOICES = (
    ("allow", "Allow"),
    ("review", "Review"),
    ("reject", "Reject"),
)


class CommunityPost(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_posts",
    )
    title = models.CharField(max_length=200, blank=True)
    content = models.TextField()
    lesson = models.ForeignKey(
        Lesson,
        on_delete=models.CASCADE,
        related_name="discussion_posts",
        null=True,
        blank=True,
    )
    moderation_status = models.CharField(
        max_length=20,
        choices=MODERATION_CHOICES,
        default="allow",
    )
    moderation_reason = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        if self.lesson:
            return f"{self.author} - {self.lesson.title}"
        return f"{self.author} - Community Post"


class CommunityComment(models.Model):
    post = models.ForeignKey(
        CommunityPost,
        on_delete=models.CASCADE,
        related_name="comments",
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="community_comments",
    )
    content = models.TextField()
    moderation_status = models.CharField(
        max_length=20,
        choices=MODERATION_CHOICES,
        default="allow",
    )
    moderation_reason = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.author} -> {self.post.id}"