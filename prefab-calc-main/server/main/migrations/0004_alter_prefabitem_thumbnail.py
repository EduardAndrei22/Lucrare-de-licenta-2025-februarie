# Generated by Django 5.0.4 on 2024-05-20 10:57

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0003_alter_prefabitem_internalname"),
    ]

    operations = [
        migrations.AlterField(
            model_name="prefabitem",
            name="thumbnail",
            field=models.URLField(default="https://via.placeholder.com/150"),
        ),
    ]
