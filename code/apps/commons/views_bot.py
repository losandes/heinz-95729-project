import logging
from django.shortcuts import render
from apps.bot.views import get_bot_response
logger = logging.getLogger(__name__)
from datetime import datetime

# @my_login_required
class BotPageViews:
    def get_message_from_bot(request):
        if request.method == "GET":
            logger.info(
                "rend the page first ")
            start_time = datetime.now()
            context = {}
            context["start_time"] =start_time

            return render(request, "online-store/" + "message" + ".html", context)
        if request.method == "POST":
            return get_bot_response(request)
