from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/auth/', include('accounts.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/wishlist/', include('wishlist.urls')),
    path(
        'api/auth/token/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair',
    ),

    path(
        'api/auth/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh',
    ),
]

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)