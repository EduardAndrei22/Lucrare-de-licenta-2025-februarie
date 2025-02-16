from django.contrib.auth.models import User
from django.db import models


class PrefabItem(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    thumbnail = models.TextField(default="https://via.placeholder.com/250")
    internalname = models.CharField(max_length=100, unique=True, default="unset")
    instock = models.IntegerField(
        default=1
    )  # 0 - not in stock, 1 - in stock, 2 - low stock
    stock = models.IntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    product_code = models.CharField(max_length=100, default="unset")
    dimensions = models.TextField(blank=True)

    def __str__(self):
        return self.name + " - " + self.description


class SavedPrefabs(models.Model):
    prefab_id = models.ForeignKey(PrefabItem, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    config = models.JSONField(default=dict)

    def __str__(self):
        return self.prefab_id.name + " - " + self.user_id.username


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    items = models.ManyToManyField(PrefabItem, blank=True)

    def __str__(self):
        return self.name


class Client(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField(blank=True)
    phone = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    bank = models.CharField(blank=True)
    iban = models.CharField(blank=True)
    cui = models.CharField()  # ro sau fara ro / grup de cifre - min 5 si max 10
    reg = models.CharField()  # J / indicativ jud / numar de la reg com si data (anul)

    def __str__(self):
        return self.name + " - " + self.address


class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    items = models.JSONField(default=dict)
    total = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    status = models.CharField(max_length=100, default="pending") # în stoc/ stoc insuficient/ finalizată/ anulată
    address = models.TextField(blank=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, blank=True)
    date_added = models.DateTimeField()
    date_updated = models.DateTimeField()
    date_due = models.DateTimeField()
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=100, decimal_places=2, default=0)
    shipping = models.DecimalField(max_digits=100, decimal_places=2, default=0)

    def __str__(self):
        return self.user.username + " - " + self.status


class PrefabStockHistory(models.Model):
    prefab = models.ForeignKey(PrefabItem, on_delete=models.CASCADE)
    stock = models.IntegerField()
    date = models.DateTimeField()
    type = models.CharField(max_length=8) # + / -
    quantity = models.IntegerField()
    reason = models.TextField(blank=True)

    def __str__(self):
        return self.prefab.name + " - " + self.date.strftime("%Y-%m-%d %H:%M:%S")