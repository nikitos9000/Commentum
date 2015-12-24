def get_page_url_by_id(request, page_id):
    if not request: return None, None

    from models import Page
    from service_utils import serialize_url

    page = Page.objects.get(id = page_id)
    page_url = serialize_url(page.host, page.port, page.path, page.params)
    page_base_url = serialize_url(page.host, page.port, page.path)
    return page_url, page_base_url


def get_server_config(request):
    return dict(host = request.META['HTTP_HOST'], service = 'service', static = 'static')