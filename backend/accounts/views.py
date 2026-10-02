from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator

from .serializers import (
    RegisterSerializer,
    ProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProfileSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = self.serializer_class(
            request.user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data)
        
class ForgotPasswordView(generics.GenericAPIView):

    def post(self, request):
        email = request.data.get("email", "").strip().lower()

        if not email:
            return Response(
                {"error": "Email is required."},
                status=400
            )

        User = get_user_model()

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({
                "message": "If an account exists with this email, "
                           "a password reset request has been created."
            })

        token = default_token_generator.make_token(user)

        return Response({
            "message": "Password reset request created.",
            "uid": user.id,
            "token": token,
        })


class ResetPasswordView(generics.GenericAPIView):

    def post(self, request):
        user_id = request.data.get("uid")
        token = request.data.get("token")
        password = request.data.get("password")

        if not user_id or not token or not password:
            return Response(
                {
                    "error":
                    "UID, token and password are required."
                },
                status=400
            )

        if len(password) < 8:
            return Response(
                {
                    "error":
                    "Password must be at least 8 characters."
                },
                status=400
            )

        User = get_user_model()

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid reset request."},
                status=400
            )

        if not default_token_generator.check_token(
            user,
            token
        ):
            return Response(
                {"error": "Invalid or expired reset token."},
                status=400
            )

        user.set_password(password)
        user.save()

        return Response({
            "message": "Password reset successfully."
        })