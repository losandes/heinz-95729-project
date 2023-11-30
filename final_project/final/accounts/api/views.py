from django.contrib.auth.models import User
import re
import re
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from requests import Session
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.views.decorators.csrf import ensure_csrf_cookie
from accounts.api.serializers import (
    UserSerializer,
    LoginSerializer,
    SignupSerializer,
)
import requests
from django.contrib.auth import (
    login as django_login,
    logout as django_logout,
    authenticate as django_authenticate,
)

logger = logging.getLogger(__name__)
logger.debug("Debug message")
logger.info("Info message")
logger.error("Error message")

from attrs import define
import jwt

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited
    """

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class AccountViewSet(viewsets.ViewSet):
    serializer_class = SignupSerializer

    @action(methods=["GET"], detail=False)
    def login_status(self, request):
        data = {"has_logged_in": request.user.is_authenticated}
        if request.user.is_authenticated:
            data["user"] = UserSerializer(request.user).data
        return Response(data)

    @action(methods=["GET"], detail=False)
    def check_authenticated(self, request):
        if request.user.is_authenticated:
            return Response({"isAuthenticated": True})
        else:
            return Response({"isAuthenticated": False})

    @action(methods=["POST"], detail=False)
    def logout(self, request):
        django_logout(request)
        return Response({"success": True})

    @action(methods=["POST"], detail=False)
    def login(self, request):
        # get username and password from request
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": serializer.errors[next(iter(serializer.errors))][0],
                    "errors": serializer.errors,
                },
                status=400,
            )

        username = serializer.validated_data["username"]
        password = serializer.validated_data["password"]

        if not User.objects.filter(username=username).exists():
            return Response(
                {
                    "success": False,
                    "message": "User does not exist.",
                },
                status=400,
            )

        user = django_authenticate(
            username=username,
            password=password,
            backend="django.contrib.auth.backends.ModelBackend",
        )
        if not user or user.is_anonymous:
            return Response(
                {
                    "success": False,
                    "message": "username and password doesn't not match",
                },
                status=400,
            )

        django_login(request, user)
        response = Response(
            {
                "success": True,
                "user": UserSerializer(user).data,
            }
        )

        return response

    @action(methods=["POST"], detail=False)
    def signup(self, request):
        """
        Use username, password and email to signup
        """
        serializer = SignupSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    "success": False,
                    "message": serializer.errors[next(iter(serializer.errors))][0],
                    "errors": serializer.errors,
                },
                status=400,
            )

        user = serializer.save()
        django_login(
            request=request,
            user=user,
            backend="django.contrib.auth.backends.ModelBackend",
        )
        return Response(
            {
                "success": True,
                "user": UserSerializer(user).data,
            },
            status=201,
        )
        
    # @login_required
    @action(methods=["GET"], detail=False)
    def display_username(self, request):
        print("cookie below")
        print(request.COOKIES)
        print(request.data)
        user = request.user
        serialized_user = self.serializer_class(user, many=False).data
        return Response(data=serialized_user, status=200)
