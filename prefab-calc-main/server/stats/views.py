from django.db.models import Sum, Count
from django.http import JsonResponse

from main.models import PrefabItem, Client, Order, Category
from rest_framework.generics import GenericAPIView
import json
from datetime import datetime

from django.contrib.auth.models import User
from django.http import JsonResponse
from rest_framework.generics import GenericAPIView
import jwt

from main.models import PrefabItem, Order, Client, PrefabStockHistory
from authentication.models import AdminUser


class MainStatsView(GenericAPIView):
    def get(self, request):
        jwt_token = request.headers["Authorization"].split(" ")[1]
        decoded_token = jwt.decode(jwt_token, options={"verify_signature": False})

        admins = AdminUser.objects.all()
        if (
                decoded_token["username"] not in admins.values_list("user__username", flat=True)
                or decoded_token["user_id"] not in admins.values_list("user_id", flat=True)
        ):
            return JsonResponse({"detail": "Acțiune nepermisă."}, status=403)

        prefab_count = PrefabItem.objects.count()
        client_count = Client.objects.count()
        order_count = Order.objects.count()
        finalized_order_count = Order.objects.filter(status="Finalizată").count()
        total_order_value = sum(
            [order.total for order in Order.objects.filter(status="Finalizată")])
        most_expensive_order = Order.objects.filter(status="Finalizată").order_by(
            "-total").first()
        most_expensive_order = {
            "id": most_expensive_order.id,
            "total": most_expensive_order.total,
            "client": {
                "id": most_expensive_order.client.id,
                "name": most_expensive_order.client.name,
            },
            "date_due": most_expensive_order.date_due,
            "items": most_expensive_order.items,
        }

        top_10_clients_by_money_spent = Client.objects.annotate(
            total_spent=Sum("order__total"), order_count=Count("order__id")).order_by("-total_spent")[:10].values("id",
                                                                                                                  "name",
                                                                                                                  "total_spent",
                                                                                                                  "order_count")
        top_10_clients_by_money_spent = list(top_10_clients_by_money_spent)

        internal_names = ['camin_beton_rect', 'capac_camin_beton_rect', 'camin_rotund', 'capac_camin_rotund', 'spalier']
        categories = Category.objects.all()
        categories_count = 0
        for category in categories:
            if any([item.internalname not in internal_names for item in category.items.all()]):
                categories_count += 1

        order_products = Order.objects.filter(status="Finalizată").values_list("items", flat=True)
        order_products = [item for sublist in order_products for item in sublist]
        products_sold_qty = {}
        for item in order_products:
            if item["id"] in products_sold_qty:
                products_sold_qty[item["id"]] += item["quantity"]
            else:
                products_sold_qty[item["id"]] = item["quantity"]

        most_sold_product = PrefabItem.objects.get(id=max(products_sold_qty, key=products_sold_qty.get))
        most_sold_product = {
            "id": most_sold_product.id,
            "name": most_sold_product.name,
            "quantity": products_sold_qty[most_sold_product.id],
        }

        return JsonResponse(
            {
                "prefab_count": prefab_count,
                "categories_count": categories_count,
                "most_sold_product": most_sold_product,
                "client_count": client_count,
                "order_count": order_count,
                "finalized_order_count": finalized_order_count,
                "total_order_value": total_order_value,
                "most_expensive_order": most_expensive_order,
                "top_10_clients": top_10_clients_by_money_spent,
            }
        )


class ProductStatsView(GenericAPIView):
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
        sales_type = data.get("sales_type")
        date_format = "%Y-%m-%d"
        if sales_type == "monthly":
            date_format = "%Y-%m"
        elif sales_type == "yearly":
            date_format = "%Y"

        order_products = Order.objects.filter(status="Finalizată").values_list("items", flat=True)
        order_products = [item for sublist in order_products for item in sublist]
        products_sold_qty = {}
        for item in order_products:
            if item["id"] in products_sold_qty:
                products_sold_qty[item["id"]] += item["quantity"]
            else:
                products_sold_qty[item["id"]] = item["quantity"]
        most_sold_prefabs = PrefabItem.objects.filter(id__in=products_sold_qty.keys())
        most_sold_prefabs = sorted(
            most_sold_prefabs, key=lambda x: products_sold_qty[x.id], reverse=True
        )
        for item in most_sold_prefabs:
            item.total_sold = products_sold_qty[item.id]

        highest_revenue_prefabs = PrefabItem.objects.filter(id__in=products_sold_qty.keys())
        highest_revenue_prefabs = sorted(
            highest_revenue_prefabs, key=lambda x: x.price * products_sold_qty[x.id], reverse=True
        )

        for item in highest_revenue_prefabs:
            item.total_revenue = item.price * products_sold_qty[item.id]

        sales_by_date = Order.objects.filter(status="Finalizată").values_list("date_due", "total")
        sales_by_date = list(sales_by_date)
        sales_by_date = [(date_due.strftime(date_format), total) for date_due, total in sales_by_date]
        sales_by_date = dict(
            (date, sum(total for date_due, total in sales_by_date if date_due == date)) for date in
            set(date for date, _ in sales_by_date))


        return JsonResponse(
            {
                "most_sold_prefabs": {
                    "names": [item.name for item in most_sold_prefabs],
                    "quantities": [item.total_sold for item in most_sold_prefabs],
                },
                "highest_revenue_prefabs": {
                    "names": [item.name for item in highest_revenue_prefabs],
                    "revenues": [item.total_revenue for item in highest_revenue_prefabs],
                },
                "sales_by_date": {
                    "dates": list(sales_by_date.keys()),
                    "totals": list(sales_by_date.values()),
                }
            }
        )


class SalesStatsView(GenericAPIView):
    def get(self, request):
        return JsonResponse({"detail": "Not implemented yet."}, status=501)
