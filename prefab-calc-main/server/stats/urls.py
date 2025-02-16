from django.urls import path
from .views import MainStatsView, ProductStatsView

urlpatterns = [
    path("general/", MainStatsView.as_view(), name="main-stats"),
    path("products/", ProductStatsView.as_view(), name="product-stats"),
]