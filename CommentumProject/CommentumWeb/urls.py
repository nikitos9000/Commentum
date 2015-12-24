from django.conf.urls.defaults import patterns
from django.conf.urls import defaults

import views

def url(regex, view, kwargs = None, name = None):
    if name:
        kwargs = kwargs and kwargs.copy() or dict()
        kwargs.update(dict(name = name))
    return defaults.url(regex, view, kwargs, name)

urlpatterns = patterns('',
    url('^$', views.index, name = 'index'),
    url('^get/$', views.get, name = 'get'),
    url('^about/$', views.about, name = 'about')
)