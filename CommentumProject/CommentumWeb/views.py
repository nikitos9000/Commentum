from CommentumProject.Commentum import api
from django.core.context_processors import csrf
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseNotAllowed
from django.shortcuts import render_to_response
from django.template.loader import render_to_string

def index(request, name):
    script_load = render_to_string('web/script_load.js', dictionary = make_template(request, name))

    template = make_template(request, name, dict(script_load = script_load))
    return render_to_response('web/index.html', dictionary = template)


def get(request, name):
    return render_to_response('web/get.html', dictionary = make_template(request, name))


def about(request, name):
    return render_to_response('web/about.html', dictionary = make_template(request, name))


def make_template(request, name, template = None):
    template = template or dict()
    template.update(dict(name = name, server = api.get_server_config(request)))
    return template

    #
    #def proxy(request, page_id):
    #    from CommentumProject.Commentum import api
    #
    #    page_url, page_base_url = api.get_page_url_by_id(page_id)
    #
    #    import urllib2
    #    import re
    #
    #    page_file = urllib2.urlopen(str(page_url))
    #    page_data = page_file.read()
    #    page_file.close()
    #
    #    template_name = options.get('template', action)
    #    template = dict(server = serialize_json(server_config(request)), page_url = serialize_json(page_url),
    #        page_base_url = page_base_url)
    #
    #    page_template = render_to_string('views/%s.%s' % (template_name, 'html'), template)
    #    page_replace = re.compile(re.escape(str("<head>")), re.IGNORECASE)
    #    page_data = page_replace.sub(str(page_template), str(page_data))
    #
    #    return HttpResponse(page_data, mimetype = 'text/html')