from django.test import TestCase
from apps.customers.models import Customer
from apps.oauth.views import create_customer

# Create your tests here.
class AuthTestCase(TestCase):

    def test_create_customer(self):
        '''create a customer, then the customer's information should be saved to the database'''
        create_customer('test', 'test@pandama.com')
        self.assertTrue(Customer.objects.filter(username='test').exists())
    
    def test_create_existing_customer(self):
        '''create a customer with existing username, then the information in database should not be updated'''
        create_customer('test', 'ttttt@test.com')
        self.assertNotEqual(Customer.objects.get(username='test'), 'ttttt@test.com')
