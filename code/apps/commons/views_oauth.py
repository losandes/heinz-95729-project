from urllib import parse
from django.shortcuts import redirect
from apps.oauth.views import deal_login_callback
from config.settings.config_oauth import GOOGLE_CLIENT_ID, GOOGLE_CALLBACK_URL, REDDIT_CLIENT_ID, REDDIT_CALLBACK_URL, GITHUB_CLIENT_ID, GITHUB_CALLBACK_URL

class AuthViews:
    def google_login(request):
        '''Redirect the user to Google's login page'''
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

    def reddit_login(request):
        '''Redirect the user to Reddit's login page'''
        from uuid import uuid4
        state = str(uuid4()) # generate a random number
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

    def github_login(request):
        '''Redirect the user to GitHub's login page'''
        from uuid import uuid4
        state = str(uuid4()) # generate a random number
        github_auth_url = '%s?%s' % ('https://github.com/login/oauth/authorize',
                                    parse.urlencode({
                                        'client_id': GITHUB_CLIENT_ID,
                                        'redirect_uri': GITHUB_CALLBACK_URL,
                                        'scope': 'user',
                                        'state': state,
                                    }))
        return redirect(github_auth_url)

    def login_callback(request):
        '''Handle the callback requests from all the identity providers'''
        code = request.GET.get("code", "")
        if code:
            if 'google' in request.META['PATH_INFO']:
                deal_login_callback(code, request, 'google')
            elif 'reddit' in request.META['PATH_INFO']:
                deal_login_callback(code, request, 'reddit')
            elif 'github' in request.META['PATH_INFO']:
                deal_login_callback(code, request, 'github')
        # if the code is not in the request parameter or the identiry provider is not valid, go back to the login page
        return redirect("store_customers_login_page")