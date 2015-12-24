from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from action_utils import action_check_arguments
from exceptions import NoAuthorizationException, NoObjectException
from models import Page, Comment, Block
from service_utils import parse_url, serialize_url, get_comment_filter, get_block_comment_filter
from utils import boolean_value, integer_value

def login_user(request, username, password):
    from django.contrib import auth

    user = auth.authenticate(username = username, password = password)

    if not user or not user.is_active:
        return None

    if user.username != request.user.username:
        auth.logout(request)
        auth.login(request, user)
    return format_user(request.user)


def logout_user(request):
    from django.contrib import auth

    auth.logout(request)
    return True


def register_user(request, username, password):
    user = _create_user(username, password)
    user.save()

    return login_user(request, username, password)


def login_user_service(request, service, **service_auth_token):
    import integration

    service = integration.get_service(service)
    service_auth_map = _get_service_auth(request, service.name)

    if not len(service_auth_token):
        service_auth = service.new_auth()
        service_auth_map[service.get_auth_key(service_auth.token)] = service_auth

        return format_url(service_auth.url)

    service_auth = service_auth_map.pop(service.get_auth_key(service_auth_token))
    service_api = service_auth.new_api(service_auth_token)

    username, password = service_api.get_username(), service_api.get_password()

    from django.contrib import auth

    user = auth.authenticate(username = username, password = password)
    if not user:
        user = _create_user(username, password, True)
        user.save()

    login_result = login_user(request, username, password)

    if login_result:
        _set_service_api(request, service.name, service_api)

    return login_result


def _create_user(username, password, overwrite = False): # TODO WARNING! FIX IT!
    from django.contrib.auth.models import User

    if User.objects.filter(username = username).exists():
        user = User.objects.get(username = username)
        if overwrite:
            user.set_password(password)
        return user

    return User.objects.create_user(username = username, password = password, email = '%s@example.com' % username)


def _get_service_auth(request, service):
    return request.session.setdefault('service_auth_%s' % service, {})


def _set_service_api(request, service, service_api):
    request.session['service_api_%s' % service] = service_api


def _get_service_api(request, service):
    return request.session['service_api_%s' % service]


def view_add_page_comment(request, page_id = None, page_url = None):
    page_id = integer_value(page_id)

    action_check_arguments(page_id, page_url)

    return {
        'page_id': page_id,
        'page_url': page_url
    }


def view_add_page_block_comment(request, page_id = None, page_url = None, block_id = None, block_text = None):
    page_id = integer_value(page_id)
    block_id = integer_value(block_id)

    action_check_arguments(page_id, page_url)
    action_check_arguments(block_id, block_text)

    return {
        'page_id': page_id,
        'page_url': page_url,
        'block_id': block_id,
        'block_text': block_text
    }


def view_page_proxy(request, page_id):
    page_id = integer_value(page_id)
    action_check_arguments(page_id)

    page = Page.objects.get(id = page_id)
    page_url = serialize_url(page.host, page.port, page.path, page.params)
    page_base_url = serialize_url(page.host, page.port, page.path)

    return {
        'page_url': page_url,
        'page_base_url': page_base_url
    }


def get_page_info(request, page_url = None, page_id = None):
    user = request.user

    page_id = integer_value(page_id)

    action_check_arguments(page_url, page_id)

    if page_id:
        try:
            page = Page.objects.get(id = page_id)
        except ObjectDoesNotExist:
            raise NoObjectException('No page exists with id = %d' % page_id)
    else:
        url_host, url_port, url_path, url_params = parse_url(page_url)

        try:
            page = Page.objects.get(
                host = url_host,
                port = url_port,
                path = url_path,
                params = url_params
            )
        except ObjectDoesNotExist:
            raise NoObjectException('No page exists with URL "%s" (host = %s, port = %s, path = %s, params = %s' %\
                                    (page_url, url_host, url_port, url_path, url_params))

    blocks = page.block_set.filter(
        get_block_comment_filter(user)
    )

    for block in blocks:
        block.comment_count = block.comment_set.filter(get_comment_filter(user)).count()

    if not blocks.exists():
        raise NoObjectException('No page comments exist with (host = %s, port = %d, path = %s, params = %s' %\
                                (page.host, page.port, page.path, page.params))

    page.comment_count = sum(block.comment_count for block in blocks)

    blocks = blocks.exclude(
        text__exact = ''
    )

    for block in blocks:
        block.comment_count = block.comment_set.filter(get_comment_filter(user)).count()

    return {
        'id': page.id,
        'comment_count': page.comment_count,
        'block_list': [format_block(block) for block in blocks]
    }


def get_page_comments(request, page_id):
    user = request.user

    page_id = integer_value(page_id)

    if not Page.objects.filter(id = page_id).exists():
        raise NoObjectException('No page exists with page_id = %d' % page_id)

    try:
        block = Block.objects.get(
            page = page_id,
            text__exact = '' # TODO Fix this shit
        )
    except ObjectDoesNotExist:
        return {
            'page_id': page_id,
            'comment_list': []
        }

    comments = Comment.objects.filter(
        get_comment_filter(user),
        block = block
    ).select_related('user')

    return {
        'page_id': page_id,
        'comment_list': [format_comment(comment) for comment in comments]
    }


def get_page_block_comments(request, page_id, block_id):
    user = request.user

    page_id = integer_value(page_id)
    block_id = integer_value(block_id)

    if not Block.objects.filter(id = block_id, page = page_id).exists():
        raise NoObjectException('No block exists with page_id = %d and block_id = %d' % (page_id, block_id))

    comments = Comment.objects.filter(
        get_comment_filter(user),
        block = block_id,
    ).select_related('user')

    return {
        'page_id': page_id,
        'block_id': block_id,
        'comment_list': [format_comment(comment) for comment in comments]
    }


def add_page_comment(request, text, public, page_id = None, page_url = None, reply_id = None):
    user = request.user

    if not user.is_authenticated():
        raise NoAuthorizationException('Cant add page comment.')

    public = boolean_value(public)
    page_id = integer_value(page_id)
    reply_id = integer_value(reply_id)

    action_check_arguments(page_url, page_id)

    with transaction.commit_on_success():
        if page_id:
            page = Page.objects.get(id = page_id)
        else:
            url_host, url_port, url_path, url_params = parse_url(page_url)

            page, page_new = Page.objects.get_or_create(
                host = url_host,
                port = url_port,
                path = url_path,
                params = url_params
            )

        block, block_new = Block.objects.get_or_create(page = page, text = '')

        comment = Comment(
            block = block,
            user = user,
            text = text,
            public = public,
            reply = reply_id
        )
        comment.save()

    _integration_service_post_comment(request, comment)

    return {
        'page_id': page.id,
        'comment': format_comment(comment)
    }


def remove_page_comment(request, page_id, comment_id):
    user = request.user

    if not user.is_authenticated():
        raise NoAuthorizationException('Cant remove page comment.')

    page_id = integer_value(page_id)
    comment_id = integer_value(comment_id)

    action_check_arguments(page_id)
    action_check_arguments(comment_id)

    with transaction.commit_on_success():
        page = Page.objects.get(id = page_id)
        block = page.block_set.get(text = '')
        comment = block.comment_set.get(id = comment_id)

        if comment.user != user:
            raise NoAuthorizationException('Cant remove page comment.')

        comment.delete()
        comment_exists = False

        page_exists = True
        block_exists = True

        if not block.comment_set.exists():
            block.delete()
            block_exists = False

            if not page.block_set.exists():
                page.delete()
                page_exists = False

    return format_comment_exists(page, block, comment, page_exists, block_exists, comment_exists)


def remove_page_block_comment(request, page_id, block_id, comment_id):
    user = request.user

    if not user.is_authenticated():
        raise NoAuthorizationException('Cant remove page block comment.')

    page_id = integer_value(page_id)
    block_id = integer_value(block_id)
    comment_id = integer_value(comment_id)

    action_check_arguments(page_id)
    action_check_arguments(block_id)
    action_check_arguments(comment_id)

    with transaction.commit_on_success():
        page = Page.objects.get(id = page_id)
        block = page.block_set.get(id = block_id)
        comment = block.comment_set.get(id = comment_id)

        if comment.user != user:
            raise NoAuthorizationException('Cant remove page block comment.')

        comment.delete()
        comment_exists = False

        page_exists = True
        block_exists = True

        if not block.comment_set.exists():
            block.delete()
            block_exists = False

            if not page.block_set.exists():
                page.delete()
                page_exists = False

    return format_comment_exists(page, block, comment, page_exists, block_exists, comment_exists)


def add_page_block_comment(request, text, public, page_id = None, page_url = None, block_id = None, block_text = None,
                           reply_id = None):
    user = request.user

    if not user.is_authenticated():
        raise NoAuthorizationException('Cant add page block comment.')

    public = boolean_value(public)
    page_id = integer_value(page_id)
    block_id = integer_value(block_id)
    reply_id = integer_value(reply_id)

    action_check_arguments(page_id, page_url)
    action_check_arguments(block_id, block_text)

    with transaction.commit_on_success():
        if page_id:
            page = Page.objects.get(id = page_id)
        else:
            url_host, url_port, url_path, url_params = parse_url(page_url)

            page, page_new = Page.objects.get_or_create(
                host = url_host,
                port = url_port,
                path = url_path,
                params = url_params
            )

        if block_id:
            block = Block.objects.get(id = block_id)
        else:
            block, block_new = Block.objects.get_or_create(
                page = page,
                text = block_text
            )

        comment = Comment(
            block = block,
            user = user,
            text = text,
            public = public,
            reply = reply_id
        )
        comment.save()

    _integration_service_post_comment(request, comment)

    return {
        'page_id': page.id,
        'block_id': block.id,
        'comment': format_comment(comment)
    }


def _integration_service_post_comment(request, comment):
    block = comment.block
    page = block.page

    page_url = serialize_url(page.host, page.port, page.path, page.params)

    if block.text:
        message = '"%s" - %s. %s' % (block.text, comment.text, page_url)
    else:
        message = '%s. %s' % (comment.text, page_url)

    import integration

    for service in integration.services.itervalues():
        service_api = _get_service_api(request, service.name)
#        service_api.post_message(message)


def format_block(block):
    return {
        'id': block.id,
        'page_id': block.page.id,
        'text': block.text,
        'comment_count': block.comment_count
    }


def format_comment(comment):
    return {
        'id': comment.id,
        'date': comment.date,
        'text': comment.text,
        'public': comment.public,
        'reply': comment.reply.id if comment.reply else None,
        'author': format_user(comment.user)
    }


def format_user(user):
    return {
        'id': user.id,
        'username': user.username
    }


def format_url(url):
    return {
        'url': url
    }


def format_comment_exists(page, block, comment, page_exists, block_exists, comment_exists):
    return {
        'page_id': page.id,
        'block_id': block.id,
        'comment_id': comment.id,
        'page_exist': page_exists,
        'block_exists': block_exists,
        'comment_exists': comment_exists
    }