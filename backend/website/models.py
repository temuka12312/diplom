from django.db import models


class LandingPageContent(models.Model):
    site_name = models.CharField(max_length=200, default="LOTUS Learn")
    hero_title = models.CharField(max_length=255, default="AI-Based Learning Platform")
    hero_subtitle = models.TextField(
        default="Хиймэл оюунд суурилсан шатлалтай сургалтын систем."
    )

    about_title = models.CharField(max_length=255, blank=True, default="Системийн тухай")
    about_text = models.TextField(
        blank=True,
        default="Энэхүү систем нь суралцагчийн түвшин, ахиц, сонирхолд тулгуурлан сургалтын материалыг илүү үр дүнтэй хүргэх зорилготой.",
    )

    feature_1_title = models.CharField(max_length=255, blank=True, default="AI Summary")
    feature_1_text = models.TextField(
        blank=True,
        default="Хичээлийн агуулгыг товч бөгөөд ойлгомжтой хураангуйлна.",
    )

    feature_2_title = models.CharField(max_length=255, blank=True, default="Adaptive Learning")
    feature_2_text = models.TextField(
        blank=True,
        default="Хэрэглэгчийн түвшинд тохирсон сургалтын зам санал болгоно.",
    )

    feature_3_title = models.CharField(max_length=255, blank=True, default="Community")
    feature_3_text = models.TextField(
        blank=True,
        default="Хэрэглэгчид хоорондоо хичээлтэй холбоотой санал бодлоо солилцоно.",
    )

    slide_image_1 = models.ImageField(upload_to="landing/", null=True, blank=True)
    slide_image_2 = models.ImageField(upload_to="landing/", null=True, blank=True)
    slide_image_3 = models.ImageField(upload_to="landing/", null=True, blank=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Landing Page Content"
        verbose_name_plural = "Landing Page Content"

    def __str__(self):
        return self.site_name


class LandingPageReview(models.Model):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=160, blank=True)
    company = models.CharField(max_length=160, blank=True)
    review_text = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("sort_order", "-created_at")
        verbose_name = "Landing Page Review"
        verbose_name_plural = "Landing Page Reviews"

    def __str__(self):
        return f"{self.name} ({self.rating}/5)"
