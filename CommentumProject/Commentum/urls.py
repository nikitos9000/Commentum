from django.conf.urls.defaults import patterns, url
from action_utils import action, include_actions
import actions
import views

urlactions = include_actions(
    action(actions.get_page_info, False, 'page'),
    action(actions.get_page_comments, False, 'page_comments'),
    action(actions.get_page_block_comments, False, 'page_block_comments'),
    action(actions.add_page_comment, False, 'page_comment_add'), # False => True
    action(actions.add_page_block_comment, False, 'page_block_comment_add'), # False => True
    action(actions.remove_page_comment, False, 'page_comment_remove'), # False => True
    action(actions.remove_page_block_comment, False, 'page_block_comment_remove'), # False => True
    action(actions.login_user, False, 'user_login'), # False => True
    action(actions.logout_user, False, 'user_logout'), # False => True
    action(actions.register_user, False, 'user_register'), # False => True
)

viewactions = include_actions(
    action(actions.view_add_page_comment, False, 'page_comment_add', template = 'comment_add'),
    action(actions.view_add_page_block_comment, False, 'page_block_comment_add', template = 'comment_add'),
    action(actions.login_user_service, False, 'user_login_service', template = 'user_login_popup'),
)

proxyactions = include_actions(
    action(actions.view_page_proxy, False, 'page_proxy'),
)

urlpatterns = patterns('',
    url('^(?P<action>[a-z_]+).json$', views.ajax_data_transport, dict(actions = urlactions)),
    url('^(?P<action>[a-z_]+).jsoncall$', views.ajax_call_data_transport, dict(actions = urlactions)),
    url('^(?P<action>[a-z_]+).view$', views.html_data_view, dict(actions = viewactions)),
    url('^(?P<action>[a-z_]+).proxy$', views.proxy_data_view, dict(actions = proxyactions)),
)