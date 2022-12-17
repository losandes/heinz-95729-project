# Create your views here.
from django.test import TestCase
from django.utils import timezone
from google.cloud import dialogflow_v2
import os
from apps.customers.models import Customer
from apps.carts.views import addCart, addCartBySessionId
from apps.orders.models import *
import environ


class botTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.test_customer = Customer(username="test_user1", email="test@cmu.edu", phone="4112938123",
                                     last_login_time=timezone.now(),
                                     password="123456", pass_salt="salt", created_time=timezone.now(),
                                     updated_time=timezone.now())
        cls.sku_number = 646
        cls.qty = 5
        cls.sessionId = 1

        # env
        root = environ.Path(__file__) - 4
        os.environ[
            "GOOGLE_APPLICATION_CREDENTIALS"] = root('env/chatbot_config.json')
        cls.DIALOGFLOW_PROJECT_ID = 'newagent-pl9e'
        cls.DIALOGFLOW_LANGUAGE_CODE = 'en'
        cls.SESSION_ID = 'anything'
        cls.text_to_be_analyzed = "null"

        cls.test_customer.save()

    def get_response(self):
        session_client = dialogflow_v2.SessionsClient()
        session = session_client.session_path(self.DIALOGFLOW_PROJECT_ID, self.SESSION_ID)
        text_input = dialogflow_v2.types.TextInput(text=self.text_to_be_analyzed,
                                                   language_code=self.DIALOGFLOW_LANGUAGE_CODE)
        query_input = dialogflow_v2.types.QueryInput(text=text_input)
        response = session_client.detect_intent(session=session, query_input=query_input)
        return response

    def test_general_question(self):
        self.text_to_be_analyzed = "pandama"
        response = self.get_response()
        assert response.query_result.fulfillment_text == "Pandama = Panda + ma. \"Panda\" is the symbol of China, it represents the Chinese featured products on our websites. We are an online store for purchasing Chinese food"

    def test_add_cart(self):
        self.text_to_be_analyzed = "cart"
        response = self.get_response()
        assert response.query_result.fulfillment_text == "do you mean add to cart? \"Y\" for yes and \"N\" for No"
        self.text_to_be_analyzed = "Y"
        response = self.get_response()
        assert response.query_result.fulfillment_text == "OK please give us the skuId with format sku:the product skuid"
        test_bot = addCart(customerId=self.test_customer.username, skuId=self.sku_number, qty=self.qty)
        self.assertIsNotNone(test_bot)

    def test_add_cart_session(self):
        self.text_to_be_analyzed = "cart"
        response = self.get_response()
        assert response.query_result.fulfillment_text == "do you mean add to cart? \"Y\" for yes and \"N\" for No"
        self.text_to_be_analyzed = "Y"
        response = self.get_response()
        assert response.query_result.fulfillment_text == "OK please give us the skuId with format sku:the product skuid"
        test_bot = addCartBySessionId(sessionId=self.sessionId, skuId=self.sku_number, qty=self.qty)
        self.assertIsNotNone(test_bot)

    def test_item_detail(self):
        self.text_to_be_analyzed = "item"
        response = self.get_response()
        assert response.query_result.fulfillment_text == "do you want to see an item detail? \"Y\" for yes and \"N\" for No"
        self.text_to_be_analyzed = "Y"
        response = self.get_response()
        assert response.query_result.fulfillment_text == "please give me the productid by format item:{itemid}"
