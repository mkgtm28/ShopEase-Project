from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as django_filters

from .models import Product
from .serializers import ProductSerializer


class ProductFilter(django_filters.FilterSet):
    ordering = django_filters.OrderingFilter(
        fields=[
            ("price", "price"),
            ("name", "name"),
            ("created_at", "created_at"),
        ]
    )

    class Meta:
        model = Product
        fields = ["category"]


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = [
        filters.SearchFilter,
        DjangoFilterBackend,
        filters.OrderingFilter,
    ]

    search_fields = [
        "name",
        "description",
        "category",
    ]

    filterset_class = ProductFilter

    ordering_fields = [
        "price",
        "name",
        "created_at",
    ]

    def get_permissions(self):
        if self.action in [
            "list",
            "retrieve",
        ]:
            return [AllowAny()]

        return [IsAdminUser()]