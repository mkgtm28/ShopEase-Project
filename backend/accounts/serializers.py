from django.contrib.auth.models import User
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username cannot be empty."
            )

        return value

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user


class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "username", "email"]

    def validate_username(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Username cannot be empty."
            )

        queryset = User.objects.filter(
            username=value
        ).exclude(
            id=self.instance.id
        )

        if queryset.exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        return value

    def validate_email(self, value):
        value = value.strip().lower()

        queryset = User.objects.filter(
            email=value
        ).exclude(
            id=self.instance.id
        )

        if queryset.exists():
            raise serializers.ValidationError(
                "This email is already in use."
            )

        return value