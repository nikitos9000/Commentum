from django import template
from django.template.defaultfilters import stringfilter
from jsmin import jsmin

register = template.Library()

@register.filter
@stringfilter
def js_minify(value):
    return jsmin(value)