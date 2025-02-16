from django.http import JsonResponse
from rest_framework.generics import GenericAPIView
from rest_framework.serializers import Serializer


class HelloView(GenericAPIView):
    serializer_class = Serializer

    def get(self, request):
        print(request)
        return JsonResponse({"message": "Hello, World!"})
