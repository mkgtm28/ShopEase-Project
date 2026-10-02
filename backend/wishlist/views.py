from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Wishlist.objects
            .filter(user=self.request.user)
            .select_related("product")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        product = serializer.validated_data["product"]

        if Wishlist.objects.filter(
            user=self.request.user,
            product=product
        ).exists():
            raise ValidationError(
                "This product is already in your wishlist."
            )

        serializer.save(
            user=self.request.user
        )


class WishlistDeleteView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(
            user=self.request.user
        )