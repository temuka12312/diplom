# backend/courses/views.py
from rest_framework import generics, permissions
from .models import Course
from .serializers import CourseSerializer


class CourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.all().order_by("id")  # created_at биш
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]


class CourseDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated]