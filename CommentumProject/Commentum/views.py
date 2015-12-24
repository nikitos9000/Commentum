from django.core.context_processors import csrf
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseNotAllowed, HttpResponseRedirect
from django.shortcuts import render_to_response
from django.template.loader import render_to_string
from convert import serialize_json
from exceptions import ActionException
from utils import execute_function, plain_object

def html_data_view(request, action, actions):
    return action_data_view(request, action, actions, 'html', 'text/html')


def action_data_view(request, action, actions, extension, mimetype):
    options = actions[action].options
    result = http_data_transport(request, action, actions, True)
    if isinstance(result, HttpResponse): return result

    data, params = result

    template_name = options.get('template', action)
    template = {'data': serialize_json(data), 'server': serialize_json(server_config(request))}
    template.update(csrf(request))
    return render_to_response('views/%s.%s' % (template_name, extension), dictionary = template, mimetype = mimetype)


def proxy_data_view(request, action, actions):
    options = actions[action].options
    result = http_data_transport(request, action, actions, True)
    if isinstance(result, HttpResponse): return result

    data, params = result

    import urllib2
    import re

    page_url = data['result']['page_url']
    page_base_url = data['result']['page_base_url']

    page_file = urllib2.urlopen(str(page_url))
    page_data = page_file.read()
    page_file.close()

    template_name = options.get('template', action)
    template = dict(server = serialize_json(server_config(request)), page_url = serialize_json(page_url),
        page_base_url = page_base_url)

    page_template = render_to_string('views/%s.%s' % (template_name, 'html'), template)
    page_replace = re.compile(re.escape(str("<head>")), re.IGNORECASE)
    page_data = page_replace.sub(str(page_template), str(page_data))

    return HttpResponse(page_data, mimetype = 'text/html')


def ajax_call_data_transport(request, action, actions):
    result = http_data_transport(request, action, actions, False)
    if isinstance(result, HttpResponse): return result

    data, params = result

    template = {'callback': params['callback'], 'data': serialize_json(data)}
    return render_to_response('transports/ajaxcall.js', dictionary = template, mimetype = 'application/x-javascript')


def ajax_data_transport(request, action, actions):
    result = http_data_transport(request, action, actions, True)
    if isinstance(result, HttpResponse): return result

    data, params = result

    return HttpResponse(serialize_json(data), mimetype = 'application/json')


def http_data_transport(request, action, actions, post):
    action_object = actions[action]

    if not action_object or (not post and action_object.post):
        return HttpResponseNotFound()

    action_method = action_get_method(action_object)
    if request.method != action_method:
        return HttpResponseNotAllowed([action_method])

    input_get = dict((k, v) for k, v in request.GET.iteritems())
    input_post = dict((k, v) for k, v in request.POST.iteritems())
    params = input_post if action_object.post else input_get

    output, result = action_data_transport(request, action_object, post, params)

    output = dict((k, plain_object(v)) for k, v in output.iteritems())
    output_map = {'url': lambda value: HttpResponseRedirect(value)}

    if result and isinstance(result, dict):
        key = next((key for key in iter(output_map) if key in result), None)
        if key: return output_map[key](result[key])

    return output, params


def action_data_transport(request, action, post, params):
    try:
        action_result = action_execute(request, action, params)
        auth = request.user.is_authenticated()
        return action_data_result(action.name, auth, post, action_result), action_result
    except ActionException as exception:
        auth = request.user.is_authenticated()
        return action_data_error(action.name, auth, post, exception.code, exception.message), None


def action_execute(request, action, params):
    return execute_function(action.function, request = request, **params)


def action_data_result(action, auth, post, result):
    return {
        'action': action,
        'status': 0,
        'auth': auth,
#        'post': post,
        'result': result
    }


def action_data_error(action, auth, post, status, error):
    return {
        'action': action,
        'status': status,
        'auth': auth,
#        'post': post,
        'error': error
    }


def action_get_method(action):
    return 'POST' if action.post else 'GET'


def server_config(request):
    return {
        'host': request.META['HTTP_HOST'],
        'service': 'service',
        'static': 'static',
        'static_js': 'static/js',
        'static_css': 'static/css'
    }