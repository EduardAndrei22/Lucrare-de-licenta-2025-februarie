# Generated by Django 5.0.4 on 2024-06-12 15:42

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0009_alter_prefabitem_thumbnail"),
    ]

    operations = [
        migrations.AlterField(
            model_name="prefabitem",
            name="thumbnail",
            field=models.URLField(default="https://via.placeholder.com/150"),
        ),
    ]
