# Generated by Django 5.0.4 on 2024-07-06 09:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0018_client_order_client"),
    ]

    operations = [
        migrations.AddField(
            model_name="client",
            name="bank",
            field=models.CharField(blank=True),
        ),
        migrations.AddField(
            model_name="client",
            name="cui",
            field=models.CharField(default=""),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="client",
            name="iban",
            field=models.CharField(blank=True),
        ),
        migrations.AddField(
            model_name="client",
            name="reg",
            field=models.CharField(default=""),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="client",
            name="address",
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name="client",
            name="email",
            field=models.EmailField(blank=True, max_length=254),
        ),
        migrations.AlterField(
            model_name="client",
            name="phone",
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
