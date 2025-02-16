from django.contrib import admin
from django.urls import path, include
from .views import HelloView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/hello/", HelloView.as_view()),
    path("api/auth/", include("authentication.urls")),
    path("api/main/", include("main.urls")),
    path("api/stats/", include("stats.urls")),
]
