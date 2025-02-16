import json

from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.views import TokenObtainPairView
import jwt

from .serializers import RegisterForm, CustomTokenObtainPairSerializer
from .api_helpers import email_exists, username_exists
from .models import Variables, AdminUser


class RegisterView(GenericAPIView):
    serializer_class = RegisterForm

    def post(self, request):
        data = json.loads(request.body)
        username = data.get("username")
        password = data.get("password")
        master_password = data.get("masterPassword")
        email = data.get("email")

        if (
                Variables.objects.filter(name="masterpassword").get().value
                != master_password
        ):
            return JsonResponse({"detail": "Master password is incorrect"}, status=400)

        if username is None or password is None or email is None:
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if username == "" or password == "" or email == "":
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if username_exists(username):
            return JsonResponse({"detail": "Username already exists."}, status=400)

        if email_exists(email):
            return JsonResponse({"detail": "Email already exists."}, status=400)

        try:
            user = User.objects.create_user(username=username, email=email)
            user.set_password(password)
            user.save()
        except Exception:
            return JsonResponse(
                {"detail": "Error on register. Please try again."}, status=400
            )

        return JsonResponse(
            {"detail": "Registered successfully. You can now log in!"}, status=201
        )


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        return_value = super(CustomTokenObtainPairView, self).post(
            request, *args, **kwargs
        )

        return_value.data["is_admin"] = AdminUser.objects.filter(user__username=request.data.get("username")).exists()
        return return_value


class MasterPasswordView(GenericAPIView):
    def post(self, request):
        data = json.loads(request.body)
        token = data.get("access_token")
        master_password = data.get("currentPassword")
        new_password = data.get("newPassword")

        decoded_token = jwt.decode(token, options={"verify_signature": False})

        if decoded_token["username"] != "admin" or decoded_token["user_id"] != 1:
            return JsonResponse({"detail": "Not allowed."}, status=403)

        if (
                Variables.objects.filter(name="masterpassword").get().value
                != master_password
        ):
            return JsonResponse({"error": "Master password is incorrect"}, status=400)

        Variables.objects.filter(name="masterpassword").update(value=new_password)

        return JsonResponse(
            {"detail": "Master password changed successfully."}, status=200
        )


class AdminView(GenericAPIView):
    def get(self, request):
        admins = AdminUser.objects.all()
        return JsonResponse(
            [
                {"username": admin.user.username, "user_id": admin.user_id, "email": admin.user.email}
                for admin in admins
            ], safe=False
        )

    def post(self, request):
        data = json.loads(request.body)
        print(data)
        jwt_token = request.headers["Authorization"].split(" ")[1]
        username = data.get("username")
        user_id = data.get("user_id")
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        if admins.filter(user_id=user_id).exists():
            return JsonResponse({"detail": "Admin already exists."}, status=400)

        user = User.objects.filter(id=user_id).first()
        if user is None:
            return JsonResponse({"detail": "User not found."}, status=400)

        admin_user = AdminUser.objects.create(user=user)
        admin_user.save()

        return JsonResponse({"detail": "Admin created successfully."}, status=201)

    def delete(self, request):
        data = json.loads(request.body)
        username = data.get("username")
        user_id = data.get("user_id")

        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        admin_user = AdminUser.objects.filter(user_id=user_id).first()
        if admin_user is None:
            return JsonResponse({"detail": "Admin not found."}, status=400)

        admin_user.delete()

        return JsonResponse({"detail": "Admin deleted successfully."}, status=200)


class UserView(GenericAPIView):
    def get(self, request):
        users = User.objects.all().values("username", "id", "email")
        admins = AdminUser.objects.all().values_list("user_id", flat=True)
        return JsonResponse(
            [
                {"username": user["username"], "id": user["id"], "email": user["email"],
                 "is_admin": user["id"] in admins}
                for user in users
            ], safe=False
        )
