CLIENT_ID = ''
CLIENT_SECRET = ''

class VKService(object):
    def __init__(self):
        self.name = 'vkontakte'

    def get_auth_key(self, token):
        return VKAuth.get_key(token)

    def new_auth(self):
        return 0


class VKAuth(object):
    @staticmethod
    def get_key(token):
        return str(token[''])

    def __init__(self, api):
        self.api = api
        self.token = ''
        self.url = ''


class VKApi(object):
    def get_username(self):
        pass

    def get_password(self):
        pass

SERVICE = VKService()