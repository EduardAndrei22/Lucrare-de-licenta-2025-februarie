import json
from datetime import datetime

from django.http import JsonResponse
from rest_framework.generics import GenericAPIView
import jwt
import os

from .models import PrefabItem, Category, PrefabStockHistory, Order
from authentication.models import AdminUser
from .variables import INTERNAL_NAMES
from PIL import Image
import base64
import tempfile


class PrefabByCategoryView(GenericAPIView):
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
        return_value = []

        for category in categories:
            return_value.append(
                {
                    "id": category.id,
                    "name": category.name,
                    "items": [
                        {
                            "id": item.id,
                            "name": item.name,
                            "description": item.description,
                            "thumbnail": item.thumbnail,
                            "internalname": item.internalname,
                            "instock": item.instock,
                            "price": item.price,
                            "cost": item.cost,
                            "stock": item.stock,
                            "product_code": item.product_code,
                            "dimensions": getattr(item, "dimensions", {}),
                        }
                        for item in category.items.all()
                    ],
                }
            )

        return JsonResponse(return_value, safe=False)


class PrefabItemView(GenericAPIView):
    def get(self, request):
        prefabs = PrefabItem.objects.all()
        return_value = []

        for prefab in prefabs:
            category = Category.objects.filter(items__id=prefab.id).first()
            return_value.append(
                {
                    "id": prefab.id,
                    "name": prefab.name,
                    "description": prefab.description,
                    "thumbnail": prefab.thumbnail,
                    "internalname": prefab.internalname,
                    "instock": prefab.instock,
                    "stock": prefab.stock,
                    "price": prefab.price,
                    "cost": prefab.cost,
                    "category": {
                        "label": category.name if category else "Necategorizat",
                        "value": category.id if category else 0,
                    },
                    "product_code": prefab.product_code,
                    "dimensions": getattr(prefab, "dimensions", {}),
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
        description = data.get("description")
        thumbnail = data.get("thumbnail")
        internalname = data.get("internalname")
        category = data.get("category")
        price = data.get("price")
        cost = data.get("cost")
        stock = data.get("stock")
        product_code = data.get("product_code")
        dimensions = data.get("dimensions")

        if stock is None:
            stock = 1

        if stock < 10:
            instock = 2
        else:
            instock = 1

        if category is None:
            category = "Necategorizat"

        if (
                name is None
                or description is None
                or internalname is None
                or instock is None
        ):
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        if name == "" or description == "" or internalname == "" or instock is None:
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        if PrefabItem.objects.filter(internalname=internalname).exists():
            return JsonResponse(
                {"detail": "Există deja un produs cu acest nume intern."}, status=400
            )

        if PrefabItem.objects.filter(product_code=product_code).exists():
            return JsonResponse(
                {"detail": "Există deja un produs cu acest cod de produs"}
            )

        if category == "Mobilier urban":
            cost = price

        if (
                float(price) <= 0 or float(cost) <= 0
        ) and internalname not in INTERNAL_NAMES:
            return JsonResponse(
                {"detail": "Prețul nu poate fi mai mic decât 0."}, status=400
            )

        try:
            prefab = PrefabItem.objects.create(
                name=name,
                description=description,
                thumbnail=thumbnail,
                internalname=internalname,
                instock=instock,
                stock=stock,
                price=price,
                cost=cost,
                dimensions=dimensions,
            )
            prefab.save()

            if (
                    product_code is not None
                    and product_code != ""
                    and len(product_code) > 1
            ):
                prefab.product_code = product_code
            else:
                prefab.product_code = prefab.id

            prefab.save()

            (
                prefab.category_set.add(Category.objects.get(name=category))
                if category
                else prefab.category_set.add(Category.objects.get(name="Necategorizat"))
            )
            prefab.save()

            stock_history = PrefabStockHistory.objects.create(
                prefab=prefab,
                stock=stock,
                date=datetime.now(),
                reason="Creare produs",
                type="+",
                quantity=stock,
            )
            stock_history.save()

        except Exception:
            return JsonResponse(
                {"detail": "Eroare la creare. Încearcă din nou."}, status=400
            )

        return JsonResponse({"detail": "Produs adăugat cu succes."}, status=201)

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
        id = data.get("id")
        name = data.get("name")
        description = data.get("description")
        thumbnail = data.get("thumbnail")
        internalname = data.get("internalname")
        instock = data.get("instock")
        stock = data.get("stock")
        price = data.get("price")
        cost = data.get("cost")
        category = data.get("category")
        product_code = data.get("product_code")
        dimensions = data.get("dimensions")

        if (
                name is None
                or description is None
                or internalname is None
                or instock is None
        ):
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        if name == "" or description == "" or internalname == "" or instock is None:
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        try:
            prefab = PrefabItem.objects.get(id=id)
            prefab.description = description
            prefab.thumbnail = thumbnail
            prefab.internalname = internalname
            prefab.instock = instock
            prefab.stock = stock
            prefab.price = price
            prefab.cost = cost
            prefab.product_code = product_code
            prefab.dimensions = dimensions

            if (
                    float(price) <= 0 or float(cost) <= 0
            ) and prefab.internalname not in INTERNAL_NAMES:
                raise Exception("Prețul nu poate fi mai mic decât 0.")

            if instock == 0:
                prefab.stock = 0

            if 0 < int(stock) < 10:
                prefab.instock = 2
            elif int(stock) >= 10:
                prefab.instock = 1
            elif int(stock) == 0:
                prefab.instock = 0

            prefab.save()

            orders = Order.objects.all().exclude(status="Anulată").exclude(status="Finalizată")
            for order in orders:
                for item in order.items:
                    if item["id"] == prefab.id:
                        item["instock"] = prefab.instock
                        item["stock"] = prefab.stock
                order.save()

            for order in orders:
                any_insufficient_stock = False
                for item in order.items:
                    if int(item["stock"]) < int(item["quantity"]):
                        any_insufficient_stock = True
                        order.status = "Stoc insuficient"
                if any_insufficient_stock:
                    order.save()
                else:
                    order.status = "În stoc"
                    order.save()

            prefab.category_set.clear()
            (
                prefab.category_set.add(Category.objects.get(name=category["label"]))
                if category
                else prefab.category_set.add(Category.objects.get(name="Necategorizat"))
            )

            prefab.save()
        except Exception as e:
            print(str(e))
            return JsonResponse(
                {"detail": "Eroare la actualizare. Încearcă din nou."}, status=400
            )

        return JsonResponse({"detail": "Actualizat cu succes."}, status=200)

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
        internalname = data.get("internalname")

        if internalname in INTERNAL_NAMES:
            return JsonResponse(
                {"detail": "Acest produs nu poate fi șters."}, status=400
            )

        if internalname is None:
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        if internalname == "":
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        try:
            prefab = PrefabItem.objects.get(internalname=internalname)
            orders = (
                Order.objects.all()
                .exclude(status="Anulată")
                .exclude(status="Finalizată")
            )
            product_in_orders = False
            order_ids = []

            for order in orders:
                for item in order.items:
                    if item["id"] == prefab.id:
                        product_in_orders = True
                        order_ids.append(order.id)

            if product_in_orders:
                return JsonResponse(
                    {
                        "detail": f"Produsul este în comenzile: {', '.join([str(order_id) for order_id in order_ids])}. Șterge comenzile înainte de a șterge produsul."
                    }, status=400
                )

            prefab.delete()
        except Exception as e:
            return JsonResponse(
                {"detail": "Eroare la ștergere. Încearcă din nou."}, status=400
            )

        return JsonResponse({"detail": "Produs șters cu succes."}, status=200)


class ThumbnailUploadView(GenericAPIView):
    def post(self, request):
        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        image = request.FILES.get("thumbnail")
        filename = request.build_absolute_uri().split("?=")[-1]

        if image is None:
            return JsonResponse({"detail": "Te rog alege un fișier."}, status=400)

        if image.content_type.split("/")[0] != "image":
            return JsonResponse(
                {"detail": "Fișierul ales trebuie să fie o imagine."}, status=400
            )

        try:
            tmpdir = tempfile.gettempdir()

            created_dir = os.path.join(tmpdir, "PrefabApp", "images")
            if not os.path.exists(created_dir):
                os.makedirs(created_dir)

            image_url = os.path.join(tmpdir, "PrefabApp", "images", f"{filename}.jpg")

            image = Image.open(image).convert("RGB")

            if image.height > 700:
                aspect_ratio = image.height / image.width

                new_height = 700
                new_width = int(new_height / aspect_ratio)

                resized_image = image.resize(
                    (new_width, new_height), Image.Resampling.NEAREST
                )
                resized_image.save(image_url, "JPEG", quality=75)
            else:
                image.save(image_url, "JPEG", quality=75)

            encoded_image = base64.b64encode(open(image_url, "rb").read()).decode(
                "utf-8"
            )
            b64_image = f"data:image/jpeg;base64,{encoded_image}"

            return JsonResponse(
                {
                    "detail": "Imagine încărcată cu succes.",
                    "filepath": f"{image_url}",
                    "temp_path": f"{b64_image}",
                },
                status=201,
            )
        except Exception as e:
            print(str(e))
            return JsonResponse(
                {"detail": "Eroare la încărcare. Încearcă din nou."}, status=400
            )


class GetStockHistoryView(GenericAPIView):
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
        internalname = data.get("internalname")

        if internalname is None:
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        if internalname == "":
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        try:
            stock_history = PrefabStockHistory.objects.filter(
                prefab__internalname=internalname
            ).order_by("date")
            return_value = []

            for history in stock_history:
                date = history.date.strftime("%d/%m/%Y %H:%M")
                return_value.append(
                    {
                        "id": history.id,
                        "product_id": history.prefab.id,
                        "stock": history.stock,
                        "date": date,
                        "reason": history.reason,
                        "type": history.type,
                        "quantity": history.quantity,
                    }
                )

            return JsonResponse(return_value, safe=False)
        except Exception as e:
            return JsonResponse(
                {"detail": "Eroare la preluare. Încearcă din nou."}, status=400
            )


class AddStockHistoryView(GenericAPIView):
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
        internalname = data.get("internalname")
        stock = data.get("stock")
        reason = data.get("reason")
        change_type = data.get("type")
        quantity = data.get("quantity")

        if quantity == 0:
            return JsonResponse(
                {"detail": "Cantitatea trebuie să fie diferită de 0."}, status=400
            )

        if reason == "":
            return JsonResponse(
                {"detail": "Este nevoie de un motiv pentru modificarea stocului."},
                status=400,
            )

        if (
                internalname is None
                or stock is None
                or reason is None
                or change_type is None
                or quantity is None
        ):
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        if (
                internalname == ""
                or stock == ""
                or reason == ""
                or change_type == ""
                or quantity == ""
        ):
            return JsonResponse({"detail": "Completează toate câmpurile."}, status=400)

        if change_type not in ["+", "-"]:
            return JsonResponse(
                {"detail": "Tipul de modificare trebuie să fie + sau -."}, status=400
            )

        try:
            prefab = PrefabItem.objects.get(internalname=internalname)
            prefab.stock = stock
            prefab.save()

            orders = Order.objects.all().exclude(status="Anulată").exclude(status="Finalizată")
            for order in orders:
                for item in order.items:
                    if item["id"] == prefab.id:
                        item["instock"] = prefab.instock
                        item["stock"] = prefab.stock
                order.save()

            for order in orders:
                any_insufficient_stock = False
                for item in order.items:
                    if int(item["stock"]) < int(item["quantity"]):
                        any_insufficient_stock = True
                        order.status = "Stoc insuficient"
                if any_insufficient_stock:
                    order.save()
                else:
                    order.status = "În stoc"
                    order.save()

            stock_history = PrefabStockHistory.objects.create(
                prefab=prefab,
                stock=stock,
                date=datetime.now(),
                reason=reason,
                type=change_type,
                quantity=quantity,
            )
            stock_history.save()
        except Exception as e:
            return JsonResponse(
                {"detail": "Eroare la adăugare. Încearcă din nou."}, status=400
            )

        return JsonResponse({"detail": "Adăugat cu succes."}, status=201)


class EnsureCategoriesView(GenericAPIView):
    def get(self, request):
        prefab_items = PrefabItem.objects.all()
        categories = Category.objects.all()

        def get_category_by_prefab_internal(internalname):
            for category in categories:
                if internalname == "camin_beton_rect":
                    if category.name == "Camine rectangulare":
                        return category
                if internalname == "capac_camin_beton_rect":
                    if category.name == "Capace de camin rectangulare":
                        return category
                if internalname == "camin_rotund":
                    if category.name == "Camine rotunde":
                        return category
                if internalname == "capac_camin_rotund":
                    if category.name == "Capace de camin rotunde":
                        return category
                if internalname == "spalier":
                    if category.name == "Spalieri":
                        return category

            return categories.filter(name="Necategorizat").first()

        for prefab_item in prefab_items:
            if not prefab_item.category_set.all():
                prefab_item.category_set.add(
                    get_category_by_prefab_internal(prefab_item.internalname)
                )
                prefab_item.save()

        return JsonResponse({"detail": "Categorii încărcate cu succes."}, status=200)
