from oauthtwitter import OAuthApi, SIGNIN_URL

CONSUMER_KEY = "R4kBdjEYbCgF06qE5odpA"
CONSUMER_SECRET = "KuWXG2U3ZZFr9hCWqKfMI6y1hfDIQMOejFIuCao"

class TwitterService(object):
    def __init__(self):
        self.api = OAuthApi(CONSUMER_KEY, CONSUMER_SECRET)
        self.name = 'twitter'

    def get_auth_key(self, token):
        return TwitterAuth.get_key(token)

    def new_auth(self):
        return TwitterAuth(self.api)


class TwitterAuth(object):
    @staticmethod
    def get_key(token):
        return str(token['oauth_token'])

    def __init__(self, api):
        self.api = api
        self.token = self.api.getRequestToken()
        self.url = self.api.getAuthorizationURL(self.token, SIGNIN_URL)

    def new_api(self, data):
        return TwitterApi(self.api, self.token, data)


class TwitterApi(object):
    def __init__(self, api, request_token, request_data):
        self.access_token = api.getAccessToken(request_token, request_data['oauth_verifier'])
        self.api = OAuthApi(CONSUMER_KEY, CONSUMER_SECRET, self.access_token['oauth_token'],
            self.access_token['oauth_token_secret'])

    def get_user_id(self):
        return self.access_token['user_id']

    def get_username(self):
        return self.access_token['screen_name']

    def get_password(self):
        return self.access_token['oauth_token_secret']

    def get_unique(self):
        return self.access_token['oauth_token'], self.access_token['oauth_token_secret']

    def post_message(self, message):
        return self.api.UpdateStatus(message)

SERVICE = TwitterService()