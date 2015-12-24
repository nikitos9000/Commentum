goog.provide('commentum.frame_events');
goog.require('commentum.utils');
goog.require('commentum.actions');
goog.require('commentum.framework');
goog.require('commentum.model');
goog.require('commentum.views');
goog.require('commentum.utils');
goog.require('commentum.settings');
goog.require('commentum.actions');

goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CrossPageChannel');

goog.require('goog.json');

goog.scope(function() {
    var events = commentum.frame_events;
    var model = commentum.model;
    var views = commentum.views;
    var utils = commentum.utils;
    var settings = commentum.settings;
    var actions = commentum.actions;

    views.events = events;

    actions.hooks.push(function(data) {
        events.on_data(data);
    });

    events.on_data_start = function(done) {
        var channel_config_string = (new goog.Uri(window.location.href)).getParameterValue('xpc');
        if (channel_config_string) {
            var channel_config = goog.json.parse(channel_config_string);
            var channel = new goog.net.xpc.CrossPageChannel(channel_config);
            channel.connect(function() {
                events.channel = channel;
                done && done();
            });
        } else done && done();
    };

    events.on_data_stop = function() {
        if (events.channel) {
            events.channel.close();
            delete events.channel;
        }
    };

    events.on_data = function(data) {
        var data_action = data.action;
        var data_value = goog.json.serialize(data);

        if (events.channel)
            events.channel.send(data_action, data_value);
    };

    events.on_page_load = function(data) {
        events.page_key = {
            id: data.page_id,
            url: data.page_url
        };

        events.block_key = {
            id: data.block_id,
            text: data.block_text
        };

        events.on_data_start(function() {
            events.on_page_show();
        });
    };

    events.on_page_show = function() {
        var objects = model.objects;

        var page_callback = function(page) {
            events.page = page;

            if (!utils.empty(events.block_key))
                return events.on_block_show();

            return events.on_page_comments_show();
        };

        objects.page_list.get(events.page_key, function(page) {
            if (page) return page_callback(page);

            return objects.page_list.insert(events.page_key, page_callback);
        });
    };

    events.on_block_show = function() {
        var page = events.page;

        var block_callback = function(block) {
            events.block = block;

            events.on_block_comments_show();
        };

        page.block_list.get(events.block_key, function(block) {
            if (block) return block_callback(block);

            return page.block_list.insert(events.block_key, block_callback)
        });
    };

    events.on_block_comments_show = function() {
        var block_comments_view = new views.FrameBlockComments(events.block.id());
        block_comments_view.show();

        var comment_post = new views.BlockCommentPost(block_comments_view, settings.post, settings.auth);
        comment_post.show();

        events.block_comments_view = block_comments_view;
        events.view = block_comments_view;

        events.on_update_view();
    };

    events.on_page_comments_show = function() {
        var page_comments_view = new views.FramePageComments();
        page_comments_view.show();

        var comment_post = new views.PageCommentPost(page_comments_view, settings.post, settings.auth);
        comment_post.show();

        events.page_comments_view = page_comments_view;
        events.view = page_comments_view;

        events.on_update_view();
    };

    events.on_page_comment_add = function(comment, done) {
        var page = events.page;

        page.comment_list.insert(comment, function(comment) {
            if (comment) {
                done && done(true);
            } else {
                done && done(false);
            }
        });
    };

    events.on_page_block_comment_add = function(block_id, comment, done) {
        var block = events.block;

        block.comment_list.insert(comment, function(comment) {
            if (comment) {
                done && done(true);
            } else {
                done && done(false);
            }
        });
    };

    events.on_user_login = function(username, password, done) {
        var objects = model.objects;

        objects.user.login(username, password, function() {
            done && done(settings.post, settings.auth);
            events.on_update_view();
        });
    };

    events.on_user_logout = function(done) {
        var objects = model.objects;

        objects.user.logout(function() {
            done && done(settings.post, settings.auth);
            events.on_update_view();
        });
    };

    events.on_user_register = function(username, password, done) {
        var objects = model.objects;

        objects.user.register(username, password, function() {
            done && done(settings.post, settings.auth);
            events.on_update_view();
        });
    };

    events.on_user_login_service = function(service, done) {
        var objects = model.objects;

        objects.user.login_service(service, function() {
            done && done(settings.post, settings.auth);
            events.on_update_view();
        });
    };

    events.on_update_view = function() {
        events.on_data({ action: 'set_height', height: events.view.height() });
    };
});