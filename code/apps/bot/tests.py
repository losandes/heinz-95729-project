# Create your views here.
from django.test import TestCase
import os
from google.api_core.exceptions import InvalidArgument
from apps.carts.views import addCart
from apps.orders.models import *

class botTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.test_customer = Customer(username="test_user1", email="test@cmu.edu", phone="4112938123",
                                 last_login_time=timezone.now(),
                                 password="123456", pass_salt="salt", created_time=timezone.now(),
                                 updated_time=timezone.now())
        cls.sku_number = 768110
        cls.qty = 5
        cls.orderid = 100000

        cls.test_customer.save()
        cls.sku_number.save()
        cls.qty.save()


    def test_add_cart(self):
        test_pay = addCart(customerId=self.test_customer.username, sku_number=self.sku_number, qty=self.qty)
        test_pay.save()
        self.assertIsNotNone(test_pay)

    def test_query_order(self):
        order = Order.objects.filter(id=orderid).order_by("-created_time"))
