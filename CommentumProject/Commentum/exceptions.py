class ActionException(Exception):
    def __init__(self, code, message):
        super(ActionException, self).__init__(code, message)

    @property
    def code(self):
        code, message = self.args
        return code

    @property
    def message(self):
        code, message = self.args
        return message

class NoAuthorizationException(ActionException):
    def __init__(self, message):
        super(NoAuthorizationException, self).__init__(1, message)

class NoObjectException(ActionException):
    def __init__(self, message):
        super(NoObjectException, self).__init__(2, message)

class InvalidInputException(ActionException):
    def __init__(self, message):
        super(InvalidInputException, self).__init__(3, message)

class InvalidActionArguments(ActionException):
    def __init__(self, message):
        super(InvalidActionArguments, self).__init__(4, message)