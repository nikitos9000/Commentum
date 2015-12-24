goog.provide('commentum.actions');
goog.require('commentum.transports');
goog.require('commentum.settings');
goog.require('commentum.utils');

goog.scope(function() {
    var actions = commentum.actions;
    var transports = commentum.transports;
    var settings = commentum.settings;
    var utils = commentum.utils;

    actions.hooks = [];  // TODO: remove that shit

    actions.result = function(callback) {  // TODO: remove that shit
        return function(data) {
            utils.foreach(actions.hooks, function(action_hook) {
                action_hook(data);
            });
            callback(data);
        }
    };

    actions.get_page_info = function(page, result) {
        return actions.transport('page', false, {
            'page_url': page.id ? null : page.url,
            'page_id': page.id
        }, actions.result(result));
    };

    actions.get_page_comments = function(page, result) {
        return actions.transport('page_comments', false, {
            'page_id': page.id
        }, actions.result(result));
    };

    actions.get_page_block_comments = function(page, block, result) {
        return actions.transport('page_block_comments', false, {
            'page_id': page.id,
            'block_id': block.id
        }, actions.result(result));
    };

    actions.add_page_comment = function(page, comment, result) {
        if (actions.has_view()) {
            return actions.view('page_comment_add', comment, {
                'page_url': page.id ? null : page.url,
                'page_id': page.id
            }, actions.result(result));
        }

        return actions.transport('page_comment_add', false, {
            'page_url': page.id ? null : page.url,
            'page_id': page.id,
            'text': comment.text,
            'public': true,
            'reply_id': comment.reply && comment.reply.id
        }, actions.result(result));
    };

    actions.add_page_block_comment = function(page, block, comment, result) {
        if (actions.has_view()) {
            return actions.view('page_block_comment_add', comment, {
                'page_url': page.id ? null : page.url,
                'page_id': page.id,
                'block_text': block.id ? null : block.text,
                'block_id': block.id
            }, actions.result(result));
        }

        return actions.transport('page_block_comment_add', false, {
            'page_url': page.id ? null : page.url,
            'page_id': page.id,
            'block_text': block.id ? null : block.text,
            'block_id': block.id,
            'text': comment.text,
            'public': true,
            'reply_id': comment.reply && comment.reply.id
        }, actions.result(result));
    };

    actions.remove_page_comment = function(page, comment, result) {
        return actions.transport('page_comment_remove', false, {
            'page_id': page.id,
            'comment_id': comment.id
        }, actions.result(result));
    };

    actions.remove_page_block_comment = function(page, block, comment, result) {
        return actions.transport('page_block_comment_remove', false, {
            'page_id': page.id,
            'block_id': block.id,
            'comment_id': comment.id
        }, actions.result(result));
    };

    actions.register_user = function(username, password, result) {
        return actions.transport('user_register', false, {
            'username': username,
            'password': password
        }, actions.result(result));
    };

    actions.login_user = function(username, password, result) {
        return actions.transport('user_login', false, {
            'username': username,
            'password': password
        }, actions.result(result));
    };

    actions.logout_user = function(result) {
        return actions.transport('user_logout', false, {
        }, actions.result(result));
    };

    actions.login_user_service = function(service, result) {
        return transports.data_popup('user_login_service', {
            'service': service
        }, actions.result(result));
    };

    actions.transport = utils.apply(function() {
        return settings.post ? transports.ajax_transport : transports.ajax_call_transport;
    }, transports);

    actions.view = utils.apply(function() {
        return settings.post ? null : transports.data_view;
    }, transports);

    actions.has_view = function() {
        return !settings.post;
    };
});