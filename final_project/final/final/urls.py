from django.contrib import admin
from django.urls import path
from final_project.final.chat.api.chat_controller import ChatResponseSet
from security.api.views import get_csrf
from rest_framework import routers
from django.urls import path, include


router = routers.DefaultRouter()

router.register(r"api/chat", ChatResponseSet, basename="chat")

urlpatterns = [
    path("", include(router.urls)),
    path('admin/', admin.site.urls),

]
