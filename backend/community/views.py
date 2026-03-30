from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import CommunityPost, CommunityComment
from .serializers import CommunityPostSerializer, CommunityCommentSerializer
from .moderation import moderate_text


class CommunityPostListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunityPostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = CommunityPost.objects.select_related("author", "lesson").prefetch_related(
            "comments__author"
        ).exclude(moderation_status="reject")

        lesson_id = self.request.query_params.get("lesson")
        if lesson_id:
            qs = qs.filter(lesson_id=lesson_id)

        return qs

    def create(self, request, *args, **kwargs):
        content = request.data.get("content", "")
        moderation = moderate_text(content)
        user = request.user

        if moderation["status"] == "reject":
            user.add_warning()
            return Response(
                {
                    "detail": "Таны бичсэн пост дүрэм зөрчсөн байна.",
                    "moderation_reason": moderation["reason"],
                    "warning": True,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            author=user,
            moderation_status=moderation["status"],
            moderation_reason=moderation["reason"],
        )

        if moderation["status"] == "review":
            user.add_warning()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CommunityCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommunityCommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = CommunityComment.objects.select_related("author", "post").exclude(
            moderation_status="reject"
        )
        post_id = self.request.query_params.get("post")
        if post_id:
            qs = qs.filter(post_id=post_id)
        return qs

    def create(self, request, *args, **kwargs):
        content = request.data.get("content", "")
        moderation = moderate_text(content)
        user = request.user

        if moderation["status"] == "reject":
            user.add_warning()
            return Response(
                {
                    "detail": "Таны бичсэн comment дүрэм зөрчсөн байна.",
                    "moderation_reason": moderation["reason"],
                    "warning": True,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(
            author=user,
            moderation_status=moderation["status"],
            moderation_reason=moderation["reason"],
        )

        if moderation["status"] == "review":
            user.add_warning()

        return Response(serializer.data, status=status.HTTP_201_CREATED)