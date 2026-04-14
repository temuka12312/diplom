from rest_framework import serializers
from .models import LandingPageContent, LandingPageReview


class LandingPageReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = LandingPageReview
        fields = (
            "id",
            "name",
            "role",
            "company",
            "review_text",
            "rating",
        )


class LandingPageContentSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField()

    def get_reviews(self, obj):
        reviews = LandingPageReview.objects.filter(is_active=True).order_by(
            "sort_order", "-created_at"
        )
        return LandingPageReviewSerializer(reviews, many=True).data

    class Meta:
        model = LandingPageContent
        fields = (
            "id",
            "site_name",
            "hero_title",
            "hero_subtitle",
            "about_title",
            "about_text",
            "feature_1_title",
            "feature_1_text",
            "feature_2_title",
            "feature_2_text",
            "feature_3_title",
            "feature_3_text",
            "slide_image_1",
            "slide_image_2",
            "slide_image_3",
            "updated_at",
            "reviews",
        )
