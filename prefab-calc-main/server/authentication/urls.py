from django.urls import path
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenVerifyView,
    TokenBlacklistView,
)
from .views import RegisterView, CustomTokenObtainPairView, MasterPasswordView, AdminView, UserView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path(
        "token/",
        CustomTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", TokenBlacklistView.as_view(), name="logout"),
    path("master/change/", MasterPasswordView.as_view(), name="master_password"),
    path("admin/", AdminView.as_view(), name="admins"),
    path("user/", UserView.as_view(), name="user"),
]
