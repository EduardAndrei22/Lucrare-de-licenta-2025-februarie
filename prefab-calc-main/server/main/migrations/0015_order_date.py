# Generated by Django 5.0.4 on 2024-07-03 18:49

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0014_prefabitem_product_code"),
    ]

    operations = [
        migrations.AddField(
            model_name="order",
            name="date",
            field=models.DateTimeField(
                auto_now_add=True, default=django.utils.timezone.now
            ),
            preserve_default=False,
        ),
    ]
