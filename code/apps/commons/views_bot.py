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


            text_to_be_analyzed = request.POST.get("message")

            #process request
            sessionId = 0
            if_login = True
            customerId = 0
            if "Customer" in request.session.keys():
                if_login = True
            else:
                if_login = False

            if not if_login:
                # If not log in
                if not request.session.session_key:
                    request.session.create()
                    # Set expiration time 60 minutes | for test set 5 minutes
                    request.session.set_expiry(60 * 60)
                sessionId = request.session.session_key
            else:
                customerId = request.session["Customer"].id

            context = get_bot_response(text_to_be_analyzed, sessionId, if_login, customerId)
        return render(request, "online-store/" + "message" + ".html", context)

