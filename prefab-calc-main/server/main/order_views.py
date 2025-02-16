import json
from datetime import datetime

from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.generics import GenericAPIView
import jwt

from .models import PrefabItem, Order, Client, PrefabStockHistory
from authentication.models import AdminUser


class OrderStatusView(GenericAPIView):
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
        order_id = data.get("id")
        status = data.get("status")

        if order_id is None or status is None:
            return JsonResponse({"detail": "Cerere incorectă."}, status=400)

        if order_id == "" or status == "":
            return JsonResponse({"detail": "Cerere incorectă."}, status=400)

        try:
            order = Order.objects.get(id=order_id)

            if order.status == "Finalizată":
                return JsonResponse(
                    {"detail": "Comanda a fost deja finalizată."}, status=400
                )

            if order.status == status:
                return JsonResponse(
                    {"detail": "Comanda are deja statusul selectat."}, status=400
                )

            if status == "Finalizată":
                for item in order.items:
                    prefab = PrefabItem.objects.get(id=item["id"])

                    if prefab.stock < item["quantity"]:
                        return JsonResponse(
                            {
                                "detail": f"Nu se poate finaliza comanda. Stoc insuficient pentru {prefab.name}."
                            },
                            status=400,
                        )

                order.status = status
                order.date_updated = datetime.now()
                order.save()
                all_orders = Order.objects.all()

                for item in order.items:
                    prefab = PrefabItem.objects.get(id=item["id"])
                    prefab.stock -= item["quantity"]

                    stock_history = PrefabStockHistory.objects.create(
                        prefab=prefab,
                        stock=prefab.stock,
                        date=datetime.now(),
                        type="-",
                        quantity=-item["quantity"],
                        reason=f"Comanda ${order.id}"
                    )
                    stock_history.save()
                    prefab.save()

                    for order in all_orders:
                        for o_item in order.items:
                            if o_item["id"] == prefab.id:
                                if order.status != "Finalizată" and order.status != "Anulată" and prefab.stock < o_item[
                                    "quantity"]:
                                    o_item["instock"] = prefab.instock
                                    o_item["stock"] = prefab.stock
                                    order.status = "Stoc insuficient"
                                    order.save()


            return JsonResponse({"detail": "Status actualizat cu succes."}, status=200)
        except Exception as e:
            print(e)
            return JsonResponse(
                {"detail": "Eroare la actualizarea statusului."}, status=400
            )


class GetOrderByIdView(GenericAPIView):
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
        order_id = data.get("id")

        if order_id is None:
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if order_id == "":
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        try:
            order = Order.objects.get(id=order_id)
        except Exception as e:
            print(e)
            return JsonResponse(
                {"detail": "Error on get. Please try again."}, status=400
            )

        return JsonResponse(
            {
                "id": order.id,
                "user_id": order.user.id,
                "username": order.user.username,
                "items": order.items,
                "total": order.total,
                "status": order.status,
                "date_added": order.date_added,
                "date_updated": order.date_updated,
                "address": order.address,
                "client": order.client.name if order.client else "Necunoscut",
                "client_id": order.client.id if order.client else 0,
                "client_phone": order.client.phone if order.client else "Necunoscut",
                "client_email": order.client.email if order.client else "Necunoscut",
                "date_due": order.date_due,
                "discount": order.discount,
                "subtotal": order.subtotal,
                "shipping": order.shipping,
            },
            status=200,
        )


class OrdersView(GenericAPIView):
    def get(self, request):
        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        orders = Order.objects.all().order_by("-date_added")
        return_value = []

        for order in orders:
            return_value.append(
                {
                    "id": order.id,
                    "user_id": order.user.id,
                    "username": order.user.username,
                    "items": order.items,
                    "total": order.total,
                    "status": order.status,
                    "date_added": order.date_added.strftime("%d/%m/%Y %H:%M"),
                    "date_updated": order.date_updated.strftime("%d/%m/%Y %H:%M"),
                    "address": order.address,
                    "client": order.client.name if order.client else "Necunoscut",
                    "client_id": order.client.id if order.client else 0,
                    "client_phone": (
                        order.client.phone if order.client else "Necunoscut"
                    ),
                    "client_email": (
                        order.client.email if order.client else "Necunoscut"
                    ),
                    "date_due": order.date_due.strftime("%d/%m/%Y"),
                    "discount": order.discount,
                    "subtotal": order.subtotal,
                    "shipping": order.shipping,
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
        user_id = data.get("user_id")
        items = data.get("items")
        total = data.get("total")
        address = data.get("address")
        date_added = datetime.now()
        date_updated = datetime.now()
        client_id = data.get("client_id")
        date_due = data.get("due_date")
        discount = data.get("discount")
        subtotal = data.get("subtotal")
        shipping = data.get("shipping")

        if (
                user_id is None
                or items is None
                or total is None
                or client_id is None
                or date_due is None
        ):
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if user_id == "" or items == "" or total == "":
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        try:
            user = User.objects.get(id=user_id)
            client_obj = Client.objects.get(id=client_id)
            order = Order.objects.create(
                user=user,
                items=items,
                total=total,
                status="În stoc",
                client=client_obj,
                date_due=date_due,
                date_added=date_added,
                date_updated=date_updated,
                address=address,
                discount=discount,
                subtotal=subtotal,
                shipping=shipping,
            )

            for item in items:
                prefab = PrefabItem.objects.get(id=item["id"])

                if prefab.stock < item["quantity"]:
                    order.status = "Stoc insuficient"

            order.save()

            return JsonResponse({"detail": "Created successfully."}, status=201)

            order.save()

        except Exception as e:
            print(e)
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
        order_id = data.get("id")
        user_id = data.get("user_id")
        items = data.get("items")
        total = data.get("total")
        status = data.get("status")
        address = data.get("address")
        date_added = datetime.now()
        date_updated = datetime.now()
        client_id = data.get("client_id")
        date_due = data.get("date_due")
        discount = data.get("discount")
        subtotal = data.get("subtotal")
        shipping = data.get("shipping")

        try:
            order = Order.objects.get(id=order_id)
            user = User.objects.get(id=user_id)
            client_obj = Client.objects.get(id=client_id)
            order.user = user
            order.items = items
            order.total = total
            order.status = status
            order.client = client_obj
            order.date_due = date_due
            order.date_added = date_added
            order.date_updated = date_updated
            order.address = address
            order.discount = discount
            order.subtotal = subtotal
            order.shipping = shipping
            order.save()
        except Exception as e:
            print(e)
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
        order_id = data.get("id")

        if order_id is None:
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        if order_id == "":
            return JsonResponse({"detail": "Please fill out all fields."}, status=400)

        try:
            order = Order.objects.get(id=order_id)
            order.delete()
        except Exception as e:
            print(e)
            return JsonResponse(
                {"detail": "Error on delete. Please try again."}, status=400
            )

        return JsonResponse({"detail": "Deleted successfully."}, status=200)
