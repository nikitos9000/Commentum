import inspect
from exceptions import InvalidActionArguments

def execute_function(function, **arguments):
    args, varargs, varkw, defaults = inspect.getargspec(function)

    rargs = args[:-len(defaults)] if defaults else args

    if any(not k in arguments for k in rargs):
        raise InvalidActionArguments('Invalid number of arguements.')

    if not varkw:
        arguments = dict((k, arguments.get(k)) for k in args if k in arguments)

    return function(**arguments)


def plain_object(object):
    if isinstance(object, dict):
        return dict((k, plain_object(v)) for k, v in object.iteritems())

    if isinstance(object, list):
        return list(plain_object(v) for v in object)

    if isinstance(object, tuple):
        return tuple(plain_object(v) for v in object)

    if hasattr(object, '__dict__'):
        return plain_object(object.__dict__)

    return object


def boolean_value(value):
    if value == True or value == False or value is None:
        return value

    if isinstance(value, basestring):
        return value.lower() == 'true'

    return None


def integer_value(value):
    if value is None:
        return value

    try:
        return int(value)
    except ValueError:
        return None


def string_value(value):
    return value if value else 'null'