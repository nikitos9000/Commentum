from importlib import import_module
from exceptions import InvalidInputException

class Action(object):
    def __init__(self, name, function, post, options):
        self.name = name
        self.function = function
        self.post = post
        self.options = options


def action(function, post, name = None, **options):
    if isinstance(function, basestring):
        dot = function.rindex('.')
        module_name = function[:dot]
        function_name = function[dot + 1:]
        function = getattr(import_module(module_name), function_name)

    if not callable(function):
        raise Exception

    return Action(name or function.__name__, function, post, options)


def include_actions(*actions):
    return dict((a.name, a) for a in actions)


def action_check_arguments(*arguments):
    if not any(arg for arg in arguments):
        raise InvalidInputException('Arguments should not be empty.')