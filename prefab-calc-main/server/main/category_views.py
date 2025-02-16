import json

from django.http import JsonResponse
from rest_framework.generics import GenericAPIView
import jwt

from authentication.models import AdminUser
from .models import Category


class CategoryView(GenericAPIView):
    def get(self, request):
        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        categories = Category.objects.all()
        return JsonResponse(
            [{"id": category.id, "name": category.name} for category in categories],
            safe=False,
        )

    def post(self, request):
        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        data = json.loads(request.body)
        name = data.get("name")

        if name is None:
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if name == "":
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if Category.objects.filter(name=name).exists():
            return JsonResponse(
                {"detail": "A category with this name already exists."}, status=400
            )

        try:
            category = Category.objects.create(name=name)
            category.save()
        except Exception:
            return JsonResponse(
                {"detail": "Error on create. Please try again."}, status=400
            )

        return JsonResponse({"detail": "Created successfully."}, status=201)

    def put(self, request):
        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        data = json.loads(request.body)
        name = data.get("name")
        new_name = data.get("newName")

        if name is None or new_name is None:
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if name == "" or new_name == "":
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        try:
            category = Category.objects.get(name=name)
            category.name = new_name
            category.save()
        except Exception:
            return JsonResponse(
                {"detail": "Error on update. Please try again."}, status=400
            )

        return JsonResponse({"detail": "Updated successfully."}, status=200)

    def delete(self, request):
        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        data = json.loads(request.body)
        name = data.get("name")

        if name is None:
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if name == "":
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        try:
            category = Category.objects.get(name=name)

            for item in category.items.all():
                item.category_set.remove(category)
                item.category_set.add(Category.objects.get(name="Necategorizat"))
                item.save()

            category.delete()
        except Exception:
            return JsonResponse(
                {"detail": "Error on delete. Please try again."}, status=400
            )

        return JsonResponse({"detail": "Deleted successfully."}, status=200)
