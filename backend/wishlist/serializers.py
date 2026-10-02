from rest_framework import serializers
from .models import Wishlist


class WishlistSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_image = serializers.SerializerMethodField()

    product_price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Wishlist
        fields = [
            "id",
            "product",
            "product_name",
            "product_image",
            "product_price",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "product_name",
            "product_image",
            "product_price",
            "created_at",
        ]

    def get_product_image(self, obj):
        if obj.product.image:
            request = self.context.get("request")

            if request:
                return request.build_absolute_uri(
                    obj.product.image.url
                )

            return obj.product.image.url

        return None