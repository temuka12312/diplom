from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer


class CourseListView(generics.ListCreateAPIView):
    queryset = Course.objects.all().order_by("-created_at")
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # course үүсгэхэд автоматаар created_by = request.user
        serializer.save(created_by=self.request.user)


class CourseDetailView(generics.RetrieveAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]


class LessonDetailView(generics.RetrieveAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]


# ШИНЭ: Lesson үүсгэх (upload хийх, list хийх)
class LessonListCreateView(generics.ListCreateAPIView):
    queryset = Lesson.objects.all().order_by("order")
    serializer_class = LessonSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        ?course=<id> параметрээр тухайн курсын хичээлүүдийг шүүж авах
        """
        qs = super().get_queryset()
        course_id = self.request.query_params.get("course")
        if course_id:
            qs = qs.filter(course_id=course_id)
        return qs

    def perform_create(self, serializer):
        # Frontend-ээс course-г FormData дотор явуулна
        serializer.save()