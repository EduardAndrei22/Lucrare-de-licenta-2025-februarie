from django.contrib.auth.models import User


def email_exists(email: str) -> bool:
    return User.objects.filter(email=email).exists()


def username_exists(username: str) -> bool:
    return User.objects.filter(username=username).exists()
