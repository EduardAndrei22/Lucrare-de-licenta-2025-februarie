from django.urls import path
from .prefabitem_views import (
    PrefabItemView,
    PrefabByCategoryView,
    ThumbnailUploadView,
    EnsureCategoriesView,
    AddStockHistoryView,
    GetStockHistoryView,
)

from .export_views import *
from .category_views import *
from .client_views import *
from .order_views import *

urlpatterns = [
    path("prefabitem/", PrefabItemView.as_view(), name="prefabitem"),
    path(
        "prefab-by-category/", PrefabByCategoryView.as_view(), name="prefab-by-category"
    ),
    path("category/", PrefabByCategoryView.as_view(), name="category"),
    path("thumbnail-upload/", ThumbnailUploadView.as_view(), name="thumbnail-upload"),
    path(
        "ensure-categories/", EnsureCategoriesView.as_view(), name="ensure-categories"
    ),
    path("order/", OrdersView.as_view(), name="order"),
    path("client/", ClientView.as_view(), name="client"),
    path("order-by-id/", GetOrderByIdView.as_view(), name="order-by-id"),
    path(
        "export-order/", ExportOrderAsExcelView.as_view(), name="export-order-as-excel"
    ),
    path(
        "export-prefabs/",
        ExportPrefabsAsExcelView.as_view(),
        name="export-prefabs-as-excel",
    ),
    path("order-status/", OrderStatusView.as_view(), name="order-status"),
    path("get-stock-history/", GetStockHistoryView.as_view(), name="get-stock-history"),
    path("add-stock-history/", AddStockHistoryView.as_view(), name="add-stock-history"),
]
