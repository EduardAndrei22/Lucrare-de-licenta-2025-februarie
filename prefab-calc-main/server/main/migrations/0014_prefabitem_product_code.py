# Generated by Django 5.0.4 on 2024-07-01 14:36

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0013_order"),
    ]

    operations = [
        migrations.AddField(
            model_name="prefabitem",
            name="product_code",
            field=models.CharField(default="unset", max_length=100),
        ),
    ]
