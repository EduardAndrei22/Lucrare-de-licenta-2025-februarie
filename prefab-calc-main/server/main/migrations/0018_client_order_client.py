# Generated by Django 5.0.4 on 2024-07-05 19:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0017_rename_user_id_order_user_order_address"),
    ]

    operations = [
        migrations.CreateModel(
            name="Client",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=100)),
                ("address", models.TextField()),
                ("phone", models.CharField(max_length=100)),
                ("email", models.EmailField(max_length=254)),
            ],
        ),
        migrations.AddField(
            model_name="order",
            name="client",
            field=models.ForeignKey(
                blank=True,
                default="",
                on_delete=django.db.models.deletion.CASCADE,
                to="main.client",
            ),
            preserve_default=False,
        ),
    ]
