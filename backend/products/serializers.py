from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = "__all__"

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Product name cannot be empty."
            )

        return value

    def validate_description(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Product description cannot be empty."
            )

        return value

    def validate_category(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError(
                "Product category cannot be empty."
            )

        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than 0."
            )

        return value