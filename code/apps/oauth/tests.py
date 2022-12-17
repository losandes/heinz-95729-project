from django.test import TestCase
from django.test.client import RequestFactory
from django.contrib.sessions.middleware import SessionMiddleware
from apps.customers.models import Customer
from apps.oauth.views import create_customer, login

# Create your tests here.
class AuthTestCase(TestCase):
    def setUp(self):
        self.customer = create_customer('test1', 'test1@pandama.com')

    def test_create_customer(self):
        '''create a customer, then the customer's information should be saved to the database'''
        create_customer('test2', 'test2@pandama.com')
        self.assertTrue(Customer.objects.filter(username='test2').exists())
    
    def test_create_existing_customer(self):
        '''create a customer with existing username, then the information in database should not be updated'''
        create_customer('test2', 'ttttt@test.com')
        self.assertNotEqual(Customer.objects.get(username='test2'), 'ttttt@test.com')

    def test_login(self):
        '''login a customer, then the customer object should apear in the request session'''
        
        # create a mock request
        rf = RequestFactory()
        request = rf.get('store/google/login/callback')
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session.save()

        # login the customer
        login(request, self.customer)
        self.assertEqual(request.session['Customer'], self.customer)

    def test_login_with_invalid_customer(self):
        '''login a customer, then it should be redirected to the login page'''
        
        # create a mock request
        rf = RequestFactory()
        request = rf.get('store/google/login/callback')
        middleware = SessionMiddleware()
        middleware.process_request(request)
        request.session.save()

        # login using None, should be redirected to the /store/login page
        re = login(request, None)
        self.assertEqual(re.url, '/store/login')
        


