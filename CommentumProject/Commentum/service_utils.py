from django.db.models.query_utils import Q

def parse_url(url):
    from urlparse import urlsplit

    url = urlsplit(url)
    return url.hostname, int(url.port or 80), url.path or '/', url.query


def serialize_url(host, port, path, params = None):
    from urlparse import urlunsplit

    scheme = "http"
    netloc = "%s:%s" % (host, port) if port else host
    return urlunsplit((scheme, netloc, path or '/', params, None))


def get_comment_filter(user):
    return Q()

    if user.is_authenticated():
        return Q(public = True) | Q(visible = user) | Q(user = user)

    return Q(public = True)


def get_block_comment_filter(user):
    return Q()

    if user.is_authenticated():
        return Q(comment__public = True) | Q(comment__visible = user) | Q(comment__user = user)

    return Q(comment__public = True)


def get_page_comment_filter(user):
    return Q()

    if user.is_authenticated():
        return Q(block__comment__public = True) | Q(block__comment__visible = user) | Q(block__comment__user = user)

    return Q(block__comment__public = True)