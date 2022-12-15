from django.test import TestCase
from django.utils import timezone
from apps.customers.models import Customer
from apps.payment.models import Payment
from config.settings.config_common import STRIPE_API_KEY
import stripe

stripe.api_key = STRIPE_API_KEY
class paymentTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.test_customer = Customer(username="test_user1", email="test@cmu.edu", phone="4112938123",
                                 last_login_time=timezone.now(),
                                 password="123456", pass_salt="salt", created_time=timezone.now(),
                                 updated_time=timezone.now())

        cls.test_customer.save()


    def test_pay(self):
        test_pay = Payment.objects.create(customer=self.test_customer,
                                          created_time=timezone.now(),
                                          customer_firstname=self.test_customer.first_name,
                                          customer_lastname=self.test_customer.last_name,
                                          customer_phone=self.test_customer.phone,
                                          customer_email=self.test_customer.email,
                                          total_price=1000,
                                          payment_status=0)
        test_pay.save()
        self.assertIsNotNone(test_pay)

    def test_stripe_connection(self):
        self.assertIsNotNone(stripe.PaymentIntent.create(amount=500, currency="gbp", payment_method="pm_card_visa"))
