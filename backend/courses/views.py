from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer


class CourseListView(generics.ListCreateAPIView):
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Course.objects.all().order_by("-created_at")

        level = self.request.query_params.get("level")
        my_level_only = self.request.query_params.get("my_level")

        if my_level_only == "1":
            user_level = getattr(self.request.user, "skill_level", None)
            if user_level:
                qs = qs.filter(level=user_level)

        elif level in ["beginner", "intermediate", "advanced"]:
            qs = qs.filter(level=level)

        return qs

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]


class LessonListCreateView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all().order_by("order")
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        course_id = self.request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs

    def perform_create(self, serializer):
        serializer.save()