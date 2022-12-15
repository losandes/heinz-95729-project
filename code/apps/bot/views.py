from django.test import TestCase
"""Install the following requirements:    dialogflow        0.5.1    google-api-core   1.4.1"""
import os
from google.cloud import dialogflow_v2
import logging
from apps.orders.models import *
from django.shortcuts import render
from datetime import datetime
from apps.carts.views import addCart, addCartBySessionId
from apps.orders.views import queryOrdersByCustomerId
from config.settings.config_common import DIALOGFLOW_PROJECT_ID


# from google.api_core.exceptions import InvalidArgument
# Create your tests here.
logger = logging.getLogger(__name__)

def get_bot_response(request):
    try:
        if request.method == "POST":
            logger.info(
                "get submitted text from html " + request.POST.get("message"))
        os.environ[
            "GOOGLE_APPLICATION_CREDENTIALS"] = '/Users/chengxinhao/Desktop/aws/diaflow/newagent-pl9e-f2862b0a6aaa.json'
        DIALOGFLOW_LANGUAGE_CODE = 'en'
        SESSION_ID = 'anything'

        text_to_be_analyzed = request.POST.get("message")
        req_time = datetime.now()

        session_client = dialogflow_v2.SessionsClient()
        session = session_client.session_path(DIALOGFLOW_PROJECT_ID, SESSION_ID)
        text_input = dialogflow_v2.types.TextInput(text=text_to_be_analyzed, language_code=DIALOGFLOW_LANGUAGE_CODE)
        query_input = dialogflow_v2.types.QueryInput(text=text_input)
        response = session_client.detect_intent(session=session, query_input=query_input)
        res_time = datetime.now()
        context = {}
        context["user_res"] = process_responce(response, request)
        context["user_req_time"] = req_time
        context["user_res_time"] = res_time
        context["user_req"] = request.POST.get("message")
        return render(request, "online-store/" + "message" + ".html", context)
    except:
        req_time = datetime.now()
        res_time = datetime.now()
        context = {}
        context["user_res"] = "wrong format of input message"
        context["user_req_time"] = req_time
        context["user_res_time"] = res_time
        context["user_req"] = request.POST.get("message")
        return render(request, "online-store/" + "message" + ".html", context)


def process_responce(response, request):
    if response.query_result.intent.display_name == "add to cart - yes - custom":
        skuid = response.query_result.query_text.split(":", 1)[1]
        #add to cart
        return add_cart_in_chat(request, skuid, 1)
    elif response.query_result.intent.display_name == "query-order - yes - custom":
        orderid = response.query_result.query_text.split(":", 1)[1]
        #search for order
        return get_order_history(request, orderid)
    else: return response.query_result.fulfillment_text

def get_order_history(request, orderid):
    order = Order.objects.filter(id=orderid).order_by("-created_time")
    return "Order ID:" + order.id + "\n" + "Order Time:" + order.created_time + "\n" + "Total Price:" + order.total_price
def add_cart_in_chat(request, sku_number, qty):
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
        # Get the session id for later operation
        sessionId = request.session.session_key
        if request.method == "POST":
            res = addCartBySessionId(sessionId, sku_number, qty)
            return res["message"]
    else:
        if request.method == "POST":
            customerId = request.session["Customer"].id
            res = addCart(customerId, sku_number, qty)
            return res["message"]



