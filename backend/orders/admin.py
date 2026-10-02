from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "quantity", "price")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "full_name",
        "total_amount",
        "status",
        "created_at",
    )

    list_display_links = ("id",)

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "full_name",
        "phone",
        "user__username",
    )

    ordering = ("-created_at",)

    fields = (
        "user",
        "full_name",
        "phone",
        "address",
        "city",
        "state",
        "pincode",
        "total_amount",
        "status",
        "created_at",
    )

    readonly_fields = (
        "user",
        "total_amount",
        "created_at",
    )

    inlines = [OrderItemInline]