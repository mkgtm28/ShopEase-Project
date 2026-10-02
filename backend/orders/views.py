from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Order
from .serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save()


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
        )


class OrderCancelView(generics.UpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        )

    def update(self, request, *args, **kwargs):
        order = self.get_object()

        if order.status not in ["Pending", "Processing"]:
            return Response(
                {
                    "detail": "This order cannot be cancelled."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = "Cancelled"
        order.save(update_fields=["status"])

        serializer = self.get_serializer(order)

        return Response(serializer.data)