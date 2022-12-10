import requests, json
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

def deal_login_callback(code, request, provider):
    if provider == 'google':
        data = get_user_info_google(code)
        customer = creat_customer(name=data['name'], email=data['email'], first_name=data['given_name'], last_name=data['family_name'])
    elif provider == 'reddit':
        data = get_user_info_reddit(code)
        customer = creat_customer(name=data['name'], email=data['name'] + '@pandama.com')
    elif provider == 'github':
        data = get_user_info_github(code)
        customer = creat_customer(name=data['login'], email=data['login'] + '@pandama.com')
    
    login(request, customer)

# Get Google user's info
def get_user_info_google(code):
    # get google access token
    auth_url = 'https://accounts.google.com/o/oauth2/token'
    body = parse.urlencode({
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_SECRET,
        'redirect_uri': GOOGLE_CALLBACK_URL,
        'grant_type': 'authorization_code'  #
    })
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    req = requests.post(auth_url, body, headers=headers)
    data = json.loads(req.content)
    
    # get google user's data
    access_token = data['access_token']
    if access_token:
        userinfo_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
        query_string = parse.urlencode({'access_token': access_token})
        resp = requests.get("%s?%s" % (userinfo_url, query_string))
        data = json.loads(resp.content)
        return data

def get_user_info_reddit(code):
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
    data = response.json()
    if 'access_token' in data:
        access_token = data['access_token']
    
    headers = {'Authorization': 'bearer ' + access_token,
                'User-Agent': 'django:pandama-ext:1.0 by /u/edForw'}
    response = requests.get("https://oauth.reddit.com/api/v1/me", headers=headers)
    data = response.json()
    return data

def get_user_info_github(code):
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
    if 'access_token' in data:
        access_token = data['access_token']
    
    if access_token:
        headers = {"Authorization": "Bearer " + access_token}
        response = requests.get("https://api.github.com/user", headers=headers)
        data = response.json()
        return data

def creat_password():
    salt = ""
    for i in range(6):
        index = math.floor(random.random() * 10)
        salt += str(index)

    password = ""
    hash_value = hashlib.sha256((salt + password).encode()).hexdigest()
    return hash_value, salt

def creat_customer(name, email, first_name="", last_name=""):
    try: 
        customer = Customer.objects.get(username = name)
    except ObjectDoesNotExist:
        hash_value, salt = creat_password()
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
    if customer is None:
        return redirect('store_customers_login_page')  
    if "Customer" in request.session.keys():
        return redirect('store_customers_home_page')            

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

