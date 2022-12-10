from urllib import parse
from django.shortcuts import redirect
from apps.customers.models import Customer
from django.core.exceptions import ObjectDoesNotExist
from apps.oauth.views import get_user_info_google, creat_customer_google, login, get_user_info_reddit, creat_customer_reddit, get_user_info_github, creat_customer_github
from config.settings.config_oauth import GOOGLE_CLIENT_ID, GOOGLE_CALLBACK_URL, REDDIT_CLIENT_ID, REDDIT_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CALLBACK_URL

class AuthViews:
    def google_login(request):
        google_auth_url = '%s?%s' % ('https://accounts.google.com/o/oauth2/auth',
                                    parse.urlencode({
                                        'response_type': 'code',
                                        'client_id': GOOGLE_CLIENT_ID,
                                        'redirect_uri': GOOGLE_CALLBACK_URL,
                                        'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
                                        'access_type': 'online',
                                        'prompt': 'consent'
                                    }))
        return redirect(google_auth_url)

    def google_login_callback(request):
        code = request.GET.get("code", "")
        if code:
            data = get_user_info_google(code)
            try: 
                customer = Customer.objects.get(username = data['name'])
            except ObjectDoesNotExist:
                customer = creat_customer_google(data)
            
            login(request, customer)

        return redirect("store_customers_login_page")

    def reddit_login(request):
        from uuid import uuid4
        state = str(uuid4())
        'client_id=CLIENT_ID&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING'
        reddit_auth_url = '%s?%s' % ('https://www.reddit.com/api/v1/authorize',
                                    parse.urlencode({
                                        'client_id': REDDIT_CLIENT_ID,
                                        'response_type': 'code',
                                        'state':state,
                                        'redirect_uri': REDDIT_CALLBACK_URL,
                                        'scope': 'identity',
                                        'duration': 'temporary',
                                    }))
        return redirect(reddit_auth_url)

    def reddit_login_callback(request):
        code = request.GET.get("code", "")
        if code:
            data = get_user_info_reddit(code)
            try: 
                customer = Customer.objects.get(username = data['name'])
            except ObjectDoesNotExist:
                customer = creat_customer_reddit(data)
            login(request, customer)
        return redirect("store_customers_login_page")

    def github_login(request):
        from uuid import uuid4
        state = str(uuid4())
        github_auth_url = '%s?%s' % ('https://github.com/login/oauth/authorize',
                                    parse.urlencode({
                                        'client_id': GITHUB_CLIENT_ID,
                                        'redirect_uri': GITHUB_CALLBACK_URL,
                                        'scope': 'user',
                                        'state': state,
                                    }))
        return redirect(github_auth_url)

    def github_login_callback(request):
        code = request.GET.get("code", "")
        if code:
            data = get_user_info_github(code)
            try: 
                customer = Customer.objects.get(username = data['login'])
            except ObjectDoesNotExist:
                customer = creat_customer_github(data)
            
            login(request, customer)

        return redirect("store_customers_login_page")