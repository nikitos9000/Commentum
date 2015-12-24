from django.conf.urls.defaults import include, patterns, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    url(r'^service/', include('CommentumProject.Commentum.urls')),
    url(r'^', include('CommentumProject.CommentumWeb.urls')),

    # Example:
    # (r'^CommentumProject/', include('CommentumProject.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # (r'^admin/', include(admin.site.urls)),
)
