
import os
from google.cloud import dialogflow_v2
import logging
from apps.orders.models import *
from django.shortcuts import render
from datetime import datetime
from apps.carts.views import addCart, addCartBySessionId
import environ
from config.settings.config_common import DIALOGFLOW_PROJECT_ID



# from google.api_core.exceptions import InvalidArgument
# Create your tests here.
logger = logging.getLogger(__name__)

def get_bot_response(text_to_be_analyzed, sessionId, if_login, customerId):
    try:

        root = environ.Path(__file__) - 4
        os.environ[
            "GOOGLE_APPLICATION_CREDENTIALS"] = root('env/chatbot_credential.json')
        DIALOGFLOW_LANGUAGE_CODE = 'en'
        SESSION_ID = 'anything'


        req_time = datetime.now()

        session_client = dialogflow_v2.SessionsClient()
        session = session_client.session_path(DIALOGFLOW_PROJECT_ID, SESSION_ID)
        text_input = dialogflow_v2.types.TextInput(text=text_to_be_analyzed, language_code=DIALOGFLOW_LANGUAGE_CODE)
        query_input = dialogflow_v2.types.QueryInput(text=text_input)
        response = session_client.detect_intent(session=session, query_input=query_input)
        res_time = datetime.now()

        context = {}
        context["user_res"] = process_responce(response, context, if_login, sessionId, customerId)
        context["user_req_time"] = req_time
        context["user_res_time"] = res_time
        context["user_req"] = text_to_be_analyzed
        return context
    except:
        req_time = datetime.now()
        res_time = datetime.now()
        context = {}
        context["user_res"] = "wrong format of input message"
        context["user_req_time"] = req_time
        context["user_res_time"] = res_time
        context["user_req"] = text_to_be_analyzed
        return context


def process_responce(response, context, if_login, sessionId, customerId):

    if response.query_result.intent.display_name == "add to cart - yes - custom":
        skuid = response.query_result.query_text.split(":", 1)[1]
        #add to cart
        return add_cart_in_chat(skuid, 1, if_login, sessionId, customerId)
    elif response.query_result.intent.display_name == "product-detail - yes - custom":
        sku = response.query_result.query_text.split(":", 1)[1]
        context["sku"] = sku

        return "click here "
    else: return response.query_result.fulfillment_text

def add_cart_in_chat(sku_number, qty, if_login, sessionId, customerId):
    if not if_login:
        # If not log in
        res = addCartBySessionId(sessionId, sku_number, qty)
        if res["status"] == 200:
            return "add success! you can check it in your cart"
        else:
            return "add failed, a wrong sku id"
    else:
        res = addCart(customerId, sku_number, qty)
        if res["status"] == 200:
            return "add success! you can check it in your cart"
        else:
            return "add failed, a wrong sku id"



