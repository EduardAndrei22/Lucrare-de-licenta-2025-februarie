import json

from django.http import JsonResponse
from rest_framework.generics import GenericAPIView
import jwt

from authentication.models import AdminUser
from .models import Client


class ClientView(GenericAPIView):
    def get(self, request):
        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        clients = Client.objects.all()
        return_value = []

        for client in clients:
            return_value.append(
                {
                    "id": client.id,
                    "name": client.name,
                    "address": client.address,
                    "phone": client.phone,
                    "email": client.email,
                    "bank": client.bank,
                    "iban": client.iban,
                    "cui": client.cui,
                    "reg": client.reg,
                }
            )

        return JsonResponse(return_value, safe=False)

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
        address = data.get("address")
        phone = data.get("phone")
        email = data.get("email")
        bank = data.get("bank")
        iban = data.get("iban")
        cui = data.get("cui")
        reg = data.get("reg")

        if any(
            [
                name is None,
                address is None,
                phone is None,
                email is None,
                bank is None,
                iban is None,
                cui is None,
                reg is None,
            ]
        ):
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if (
            Client.objects.filter(name=name).exists()
            or Client.objects.filter(cui=cui).exists()
        ):
            return JsonResponse(
                {"detail": "A client with this name already exists."}, status=400
            )

        try:
            client = Client.objects.create(
                name=name,
                address=address,
                phone=phone,
                email=email,
                bank=bank,
                iban=iban,
                cui=cui,
                reg=reg,
            )
            client.save()
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
        address = data.get("address")
        phone = data.get("phone")
        email = data.get("email")
        bank = data.get("bank")
        iban = data.get("iban")
        cui = data.get("cui")
        reg = data.get("reg")
        id = data.get("id")

        if any(
            [
                name is None,
                address is None,
                phone is None,
                email is None,
                bank is None,
                iban is None,
                cui is None,
                reg is None,
                id is None,
            ]
        ):
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if (
            name == ""
            or address == ""
            or phone == ""
            or email == ""
            or bank == ""
            or iban == ""
            or cui == ""
            or reg == ""
            or id == ""
        ):
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        try:
            client = Client.objects.get(id=id)
            client.name = name
            client.address = address
            client.phone = phone
            client.email = email
            client.bank = bank
            client.iban = iban
            client.cui = cui
            client.reg = reg
            client.save()
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
        client_id = data

        if client_id is None:
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if client_id == "":
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        try:
            client = Client.objects.get(id=client_id)
            client.delete()
        except Exception:
            return JsonResponse(
                {"detail": "Error on delete. Please try again."}, status=400
            )

        return JsonResponse({"detail": "Deleted successfully."}, status=200)
