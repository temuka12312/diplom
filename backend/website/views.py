from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import LandingPageContent
from .serializers import LandingPageContentSerializer


@api_view(["GET"])
@permission_classes([AllowAny])
def landing_content(request):
    obj = LandingPageContent.objects.first()

    if not obj:
        return Response(
            {
                "site_name": "LOTUS Learn",
                "hero_title": "AI-Based Learning Platform",
                "hero_subtitle": "Хиймэл оюунд суурилсан шатлалтай сургалтын систем.",
                "about_title": "Системийн тухай",
                "about_text": "Энэхүү систем нь суралцагчийн түвшин, ахиц, сонирхолд тулгуурлан сургалтын материалыг илүү үр дүнтэй хүргэх зорилготой.",
                "feature_1_title": "AI Summary",
                "feature_1_text": "Хичээлийн агуулгыг товч бөгөөд ойлгомжтой хураангуйлна.",
                "feature_2_title": "Adaptive Learning",
                "feature_2_text": "Хэрэглэгчийн түвшинд тохирсон сургалтын зам санал болгоно.",
                "feature_3_title": "Community",
                "feature_3_text": "Хэрэглэгчид хоорондоо хичээлтэй холбоотой санал бодлоо солилцоно.",
                "slide_image_1": None,
                "slide_image_2": None,
                "slide_image_3": None,
            }
        )

    serializer = LandingPageContentSerializer(obj, context={"request": request})
    return Response(serializer.data)