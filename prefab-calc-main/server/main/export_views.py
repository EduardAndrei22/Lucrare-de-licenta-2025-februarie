import json

from django.http import JsonResponse
from rest_framework.generics import GenericAPIView
import pandas as pd

from .models import PrefabItem, Order
from .variables import INTERNAL_NAMES


class ExportOrderAsExcelView(GenericAPIView):
    def post(self, request):
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

        print(order)


class ExportPrefabsAsExcelView(GenericAPIView):
    def get(self, request):
        prefabs = PrefabItem.objects.all()
        return_value = []

        for prefab in prefabs:
            if prefab.internalname in INTERNAL_NAMES:
                continue

            product_in_stock = "Da" if prefab.instock == 1 else "Nu"

            return_value.append(
                {
                    "Cod Produs": prefab.product_code,
                    "Nume": prefab.name,
                    "Descriere": prefab.description,
                    "În stoc": product_in_stock,
                    "Stoc": prefab.stock,
                    "Preț Unitar": prefab.price,
                    "Categorie": prefab.category_set.all()[0].name,
                }
            )

        df = pd.DataFrame(return_value)

        writer = pd.ExcelWriter("prefabs.xlsx", engine="xlsxwriter")
        df.to_excel(writer, sheet_name="Produse", index=False)

        workbook = writer.book
        worksheet = writer.sheets["Produse"]

        currency_lei_format = workbook.add_format({"num_format": "#,##0.00 lei"})

        for column in df:
            if column == "Descriere":
                col_len = 15
            else:
                col_len = max(df[column].astype(str).map(len).max(), len(column))
            col_idx = df.columns.get_loc(column)
            worksheet.set_column(col_idx, col_idx, col_len)

        light_gray_format = workbook.add_format(
            {
                "bg_color": "#F4F4F4",
                "border_color": "#646464",
                "valign": "vcenter",
                "border": 1,
            }
        )
        white_format = workbook.add_format(
            {
                "bg_color": "#FFFFFF",
                "border_color": "#646464",
                "valign": "vcenter",
                "border": 1,
            }
        )
        header_format = workbook.add_format(
            {
                "bold": True,
                "text_wrap": True,
                "align": "center",
                "valign": "vcenter",
                "bg_color": "#008080",
                "font_color": "#ffffff",
                "border": 1,
                "border_color": "#646464",
            }
        )

        worksheet.conditional_format(
            "A1:G1", {"type": "no_blanks", "format": header_format}
        )

        for i in range(len(return_value)):
            if i % 2 == 0:
                worksheet.conditional_format(
                    f"A{i + 2}:G{i + 2}",
                    {"type": "no_blanks", "format": light_gray_format},
                )
            else:
                worksheet.conditional_format(
                    f"A{i + 2}:G{i + 2}", {"type": "no_blanks", "format": white_format}
                )

        writer.close()

        return JsonResponse(return_value, safe=False)
