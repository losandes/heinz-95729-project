from rest_framework.response import Response
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.views import APIView

@api_view(['GET'])
@ensure_csrf_cookie
def get_csrf(request):
    return Response({"detail": "CSRF cookie set"}, status=204)