from django.urls import path
from .views import CommunityPostListCreateView, CommunityCommentListCreateView

urlpatterns = [
    path("posts/", CommunityPostListCreateView.as_view(), name="community-posts"),
    path("comments/", CommunityCommentListCreateView.as_view(), name="community-comments"),
]