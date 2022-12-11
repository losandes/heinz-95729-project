from django.test import TestCase
from apps.oauth.views import creat_customer
from apps.customers.models import Customer

# Create your tests here.
class AuthTestCase(TestCase):
    def setUp(self):
        creat_customer('test', 'test@pandama.com')
        creat_customer('test', 'ttt@email.com')

    def test_creat_customer(self):
        self.assertTrue(Customer.objects.filter(username='test').exists())
        
        self.assertNotEqual(Customer.objects.get(username='test'), 'ttt@email.com')
