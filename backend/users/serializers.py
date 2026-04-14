from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "password",
        )

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"],
            role="student",
            skill_level=None,
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    skill_level_display = serializers.CharField(
        source="get_skill_level_display",
        read_only=True,
    )
    avatar_url = serializers.ImageField(source="avatar", read_only=True)
    nickname = serializers.CharField(source="display_name", read_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "nickname",
            "display_name",
            "email",
            "avatar_url",
            "role",
            "skill_level",
            "skill_level_display",
            "total_score",
            "completed_lessons",
            "has_placement_test",
            "warning_count",
            "is_staff",
            "is_superuser",
        )


class ProfileUpdateSerializer(serializers.ModelSerializer):
    nickname = serializers.CharField(source="display_name", required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "nickname",
            "avatar",
        )

    def validate_username(self, value):
        user = self.instance
        if (
            User.objects.exclude(pk=user.pk)
            .filter(username__iexact=value)
            .exists()
        ):
            raise serializers.ValidationError("This username is already taken.")
        return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value
