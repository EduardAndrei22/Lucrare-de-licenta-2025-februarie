# Generated by Django 5.0.4 on 2024-05-20 11:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0005_prefabitem_instock"),
    ]

    operations = [
        migrations.AlterField(
            model_name="prefabitem",
            name="instock",
            field=models.IntegerField(default=1),
        ),
    ]
