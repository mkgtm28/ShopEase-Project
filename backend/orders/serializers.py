from django.db import transaction
from rest_framework import serializers

from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source="product.name",
        read_only=True
    )

    product_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = [
            "product",
            "product_name",
            "product_image",
            "quantity",
            "price",
        ]

        read_only_fields = [
            "price",
            "product_name",
            "product_image",
        ]

    def validate_quantity(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Quantity must be greater than zero."
            )

        return value

    def get_product_image(self, obj):
        if obj.product.image:
            request = self.context.get("request")

            if request:
                return request.build_absolute_uri(
                    obj.product.image.url
                )

            return obj.product.image.url

        return None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            "id",
            "full_name",
            "phone",
            "address",
            "city",
            "state",
            "pincode",
            "total_amount",
            "status",
            "created_at",
            "items",
        ]

        read_only_fields = [
            "id",
            "total_amount",
            "status",
            "created_at",
        ]

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")

        total_amount = 0
        order_items = []

        for item_data in items_data:
            product_id = item_data["product"].id
            quantity = item_data["quantity"]

            product = Product.objects.select_for_update().get(
                id=product_id
            )

            if product.stock < quantity:
                raise serializers.ValidationError(
                    f"Not enough stock for {product.name}."
                )

            price = product.price
            total_amount += price * quantity

            order_items.append({
                "product": product,
                "quantity": quantity,
                "price": price,
            })

        order = Order.objects.create(
            user=self.context["request"].user,
            total_amount=total_amount,
            **validated_data
        )

        for item in order_items:
            OrderItem.objects.create(
                order=order,
                product=item["product"],
                quantity=item["quantity"],
                price=item["price"],
            )

            item["product"].stock -= item["quantity"]

            item["product"].save(
                update_fields=["stock"]
            )

        return order