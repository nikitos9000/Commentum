AUTHORIZATION_URL = 'http://oauth.vk.com/authorize'
ACCESS_TOKEN_URL = 'https://oauth.vk.com/access_token'

class OAuthApi(object):
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret

    def getAuthorizationURL(self, url = AUTHORIZATION_URL):
        return "%s?client_id=%s&scope=%s&redirect_uri=%s&response_type=code" % (url, self.client_id, "", "")

    def getAccessToken(self, code, url = ACCESS_TOKEN_URL):
        token_url = "%s?client_id=%s&client_secret=%s&code=%s" % (url, self.client_id, self.client_secret, code)
