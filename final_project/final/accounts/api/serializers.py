from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework import exceptions
from django.utils.translation import gettext as _
from string import punctuation


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email")


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()


class SignupSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20, min_length=6)
    password = serializers.CharField(max_length=20, min_length=6)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def check_duplicate(self, data):
        # Check for duplicate usernames (case-insensitive)
        existing_user = (
            User.objects.filter(username__iexact=data["username"])
            .exclude(pk=self.instance.pk if self.instance else None)
            .first()
        )
        if existing_user:
            raise exceptions.ValidationError(
                {"username": "This username has been occupied."}
            )

        # Check for duplicate emails (case-insensitive)
        existing_email = (
            User.objects.filter(email__iexact=data["email"])
            .exclude(pk=self.instance.pk if self.instance else None)
            .first()
        )
        if existing_email:
            raise exceptions.ValidationError(
                {"email": "This email address has been occupied."}
            )

    def validate_password_requirements(self, value):
        # password requirements
        min_length = 8
        if len(value) < min_length:
            raise exceptions.ValidationError(
                _("Password must be at least {} characters long.").format(min_length)
            )
        # Check for at least one uppercase letter (CAP)
        if not any(char.isupper() for char in value):
            raise exceptions.ValidationError(
                _("Password must contain at least one uppercase letter.")
            )

        # Check for at least one special character
        if not any(char in punctuation for char in value):
            raise exceptions.ValidationError(
                _("Password must contain at least one underscore (_) character.")
            )

        # Check for at least one digit
        if not any(char.isdigit() for char in value):
            raise exceptions.ValidationError(
                _("Password must contain at least one digit.")
            )

    # will be called when is_valid is called
    def validate(self, data):
        self.check_duplicate(data)
        self.validate_password_requirements(data["password"])
        return data

    def create(self, validated_data):
        username = validated_data["username"]
        email = validated_data["email"]
        password = validated_data["password"]

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
        )
        return user
