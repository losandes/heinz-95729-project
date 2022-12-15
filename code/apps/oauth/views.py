import requests
from urllib import parse
from django.shortcuts import redirect
import random
import math
import hashlib
from django.utils import timezone
from apps.customers.models import Customer
from apps.carts.views import integrateCart
from django.core.exceptions import ObjectDoesNotExist
from config.settings.config_oauth import GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_CALLBACK_URL, REDDIT_CLIENT_ID, REDDIT_SECRET, REDDIT_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_SECRET, GITHUB_CALLBACK_URL
from django.shortcuts import render

def deal_login_callback(code, request, provider):
    '''
    Handle the callback request:
    1. send request to identity providers and get back the user's data
    2. create a Customer object and save it to database (if the customer does not exist already)
    3. login the customer

    Arguments:
    code: str
        The returned code from request
    request: HttpRequest
        The callback request
    provider: str
        The name of the identity provider
    '''
    customer = None
    if provider == 'google':
        data = get_user_info_google(request, code)
        customer = create_customer(name=data['name'], email=data['email'], first_name=data['given_name'], last_name=data['family_name'])
    elif provider == 'reddit':
        data = get_user_info_reddit(request, code)
        customer = create_customer(name=data['name'], email=data['name'] + '@pandama.com')
    elif provider == 'github':
        data = get_user_info_github(request, code)
        customer = create_customer(name=data['login'], email=data['login'] + '@pandama.com')
    # After creating the customer, login the customer
    login(request, customer)

def get_user_info_google(request, code):
    '''Get Google user's info'''
    # get google access token
    auth_url = 'https://accounts.google.com/o/oauth2/token'
    body = parse.urlencode({
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_SECRET,
        'redirect_uri': GOOGLE_CALLBACK_URL,
        'grant_type': 'authorization_code'
    })
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    response = requests.post(auth_url, body, headers=headers)
    if response.status_code != 200:
        data["status"] = response.status_code
        data["message"] = "Something went wrong..."
        return render(request, 'online-store/error.html', status=response.status_code, context=data)

    data = response.json()
    
    # get google user's data
    access_token = data['access_token']
    userinfo_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
    query_string = parse.urlencode({'access_token': access_token})
    response = requests.get("%s?%s" % (userinfo_url, query_string))
    data = response.json()
    return data

def get_user_info_reddit(request, code):
    '''Get Reddit user's info'''
    # get reddit access token
    auth_url = 'https://www.reddit.com/api/v1/access_token'
    client_auth = requests.auth.HTTPBasicAuth(REDDIT_CLIENT_ID, REDDIT_SECRET)
    headers = {'User-Agent': 'django:pandama-ext:1.0 by /u/edForw'}
    body = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDDIT_CALLBACK_URL
    }
    response = requests.post(auth_url, data=body, auth=client_auth, headers=headers)
    if response.status_code != 200:
        data["status"] = response.status_code
        data["message"] = "Something went wrong..."
        return render(request, 'online-store/error.html', status=response.status_code, context=data)
    
    data = response.json()

    # get reddit user's data
    access_token = data['access_token']
    headers = {'Authorization': 'bearer ' + access_token,
                'User-Agent': 'django:pandama-ext:1.0 by /u/edForw'}
    response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)
    data = response.json()
    return data

def get_user_info_github(request, code):
    '''Get GitHub user's info'''
    # get reddit access token
    auth_url = 'https://github.com/login/oauth/access_token'
    headers = {'Accept': 'application/json'}
    body = {
        'client_id': GITHUB_CLIENT_ID,
        'client_secret': GITHUB_SECRET,
        'code': code,
        'redirect_uri': GITHUB_CALLBACK_URL
    }
    response = requests.post(auth_url, data=body, headers=headers)
    data = response.json()
    if response.status_code != 200:
        data["status"] = response.status_code
        data["message"] = "Something went wrong..."
        return render(request, 'online-store/error.html', status=response.status_code, context=data)

    access_token = data['access_token']
    
    # get github user's data
    headers = {"Authorization": "Bearer " + access_token}
    response = requests.get("https://api.github.com/user", headers=headers)
    data = response.json()
    return data

def create_password():
    salt = ""
    for i in range(6):
        index = math.floor(random.random() * 10)
        salt += str(index)

    password = ""
    hash_value = hashlib.sha256((salt + password).encode()).hexdigest()
    return hash_value, salt

def create_customer(name, email, first_name="", last_name=""):
    '''Create a customer object and store it into the database,
    if the customer already exists, simply return it.
    '''
    try: # if the customer already exists
        customer = Customer.objects.get(username = name)
    except ObjectDoesNotExist: # otherwise, create the customer oject and save it to database
        hash_value, salt = create_password()
        customer = Customer(first_name=first_name,
                            last_name=last_name,
                            username=name,
                            email=email,
                            last_login_time=timezone.now(),
                            password=hash_value,
                            pass_salt=salt,
                            created_time=timezone.now(),
                            updated_time=timezone.now())
        customer.save()
    return customer


def login(request, customer):
    '''Login the user, redirect the user to the correct page'''
    if "Customer" in request.session.keys():
        return redirect('store_customers_home_page')            
    if customer is None:
        return redirect('store_customers_login_page')  

    if request.session.session_key:
        integrateCart(request.session.session_key, customer.id)

    request.session['Customer'] = customer

    last_path = request.META.get('HTTP_REFERER')
    if last_path is None or "next" not in last_path:
        return redirect("store_customers_home_page")  
    last_path = last_path[(last_path.index("next=") + 5):]
    if last_path != "":
        return redirect(last_path)
    else:
        return redirect("store_customers_home_page") 

