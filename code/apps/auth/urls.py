from django.urls import path
from apps.auth.views import AuthViews

urlpatterns = [
    path('google/login', AuthViews.google_login),
    path('google/login/callback', AuthViews.google_login_callback),
]
