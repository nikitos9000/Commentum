goog.provide('commentum.events');
goog.require('commentum.utils');
goog.require('commentum.actions');
goog.require('commentum.framework');
goog.require('commentum.model');
goog.require('commentum.views');
goog.require('commentum.utils');
goog.require('commentum.settings');

goog.scope(function() {
    var events = commentum.events;
    var model = commentum.model;
    var views = commentum.views;
    var utils = commentum.utils;
    var settings = commentum.settings;

    views.events = events;

    events.url = null;

    events.on_page_load = function(url) {
        events.url = url;

        events.on_page_show();
    };

    events.on_page_show = function() {
        var objects = model.objects;

        var page_callback = function(page) {
            var page_view = new views.Page(page.id());
            page_view.show();

            events.page = page;
            events.page_view = page_view;

            events.on_blocks_show();
            events.on_block_marker_show();
        };

        objects.page_list.get({ url: events.url }, function(page) {
            if (page)
                return page_callback(page);

            return objects.page_list.insert({ url: events.url }, page_callback);
        });
    };

    events.on_page_hide = function() {
        events.on_block_marker_hide();
        events.on_blocks_hide();

        var page_view = events.page_view;
        page_view.hide();
    };

    events.on_blocks_show = function() {
        var page = events.page;

        page.block_list.getAll(function(blocks) {

            utils.foreach(blocks, function(block) {
                events.on_block_show(block.id());
            });
        });
    };

    events.on_blocks_hide = function() {
        var page_view = events.page_view;

        utils.foreach(page_view.blocks, function(block_id) {
            events.on_block_hide(block_id);
        });
    };

    events.on_block_show = function(block_id, done) {
        var page = events.page;
        var page_view = events.page_view;

        page.block_list.get({ id: block_id }, function(block) {
            var block_view = new views.Block(page_view, events.format_block(block));
            block_view.show();

            done && done(block_id);
        });
    };

    events.on_block_hide = function(block_id) {
        var page_view = events.page_view;
        var block_view = page_view.blocks[block_id];

        events.on_block_comments_hide(block_id);
        block_view.hide();
    };

    events.on_block_comments_show = function(block_id) {
        var page = events.page;

        var page_view = events.page_view;
        var block_view = page_view.blocks[block_id];

        utils.foreach(page_view.blocks, function(block_id) {
            events.on_block_comments_hide(block_id);
        });

        page.block_list.get({ id: block_id }, function(block) {

            block.comment_list.getAll(function(comments) {
                var block_comments_view = new views.BlockComments(block_view);
                block_comments_view.show();

                utils.foreach(comments, function(comment) {

                    comment.author.get(function(author) {
                        var comment_view = new views.BlockComment(block_comments_view, events.format_comment(comment, author));
                        comment_view.show();
                    });
                });

                var comment_post = new views.BlockCommentPost(block_comments_view, settings.post, settings.auth);
                comment_post.show();
            });
        });
    };

    events.on_block_comments_hide = function(block_id) {
        var page_view = events.page_view;
        var block_view = page_view.blocks[block_id];
        var block_comments_view = block_view.block_comments;

        if (block_comments_view && block_comments_view.visible()) {
            var comments_empty = utils.empty(block_comments_view.comments);
            utils.foreach(block_comments_view.comments, function(comment_id, comment_view) {
                comment_view.hide();
            });

            if (block_comments_view.comment_post)
                block_comments_view.comment_post.hide();

            block_comments_view.hide();

            if (comments_empty)
                block_view.hide();
        }
    };

    events.on_page_comments_show = function() {
        var page = events.page;
        var page_view = events.page_view;

        page.comment_list.getAll(function(comments) {
            var page_comments_view = new views.PageComments(page_view);
            page_comments_view.show();

            utils.foreach(comments, function(comment) {

                comment.author.get(function(author) {
                    var comment_view = new views.PageComment(page_comments_view, events.format_comment(comment, author));
                    comment_view.show();
                });
            });

            var comment_post = new views.PageCommentPost(page_comments_view, settings.post, settings.auth);
            comment_post.show();
        });
    };

    events.on_page_comments_hide = function() {
        var page_view = events.page_view;
        var page_comments_view = page_view.page_comments;

        if (page_comments_view && page_comments_view.visible()) {
            utils.foreach(page_comments_view.comments, function(comment_id, comment_view) {
                comment_view.hide();
            });

            if (page_comments_view.comment_post)
                page_comments_view.comment_post.hide();

            page_comments_view.hide();
        }
    };

    events.on_page_comment_add = function(comment, done) {
        var page = events.page;
        var page_view = events.page_view;

        page.comment_list.insert(comment, function(comment) {
            if (comment) {
                var page_comments_view = page_view.page_comments;

                comment.author.get(function(author) {
                    var comment_view = new views.PageComment(page_comments_view, events.format_comment(comment, author));
                    comment_view.show();

                    done && done(true);
                });
            } else {
                done && done(false);
            }
        });
    };

    events.on_page_block_comment_add = function(block_id, comment, done) {
        var page = events.page;

        var page_view = events.page_view;
        var block_view = page_view.blocks[block_id];

        page.block_list.get({ id: block_id }, function(block) {
            block.comment_list.insert(comment, function(comment) {
                if (comment) {
                    var block_comments_view = block_view.block_comments;

                    comment.author.get(function(author) {
                        if (block_id != block.id())
                            return events.on_block_update(block_id, block.id());

                        var comment_view = new views.BlockComment(block_comments_view, events.format_comment(comment, author));
                        comment_view.show();

                        ++block_view.block_comment_count;
                        block_view.update();

                        done && done(true);
                    });
                } else {
                    done && done(false);
                }
            });
        });
    };

    events.on_block_marker_show = function() {
        var page_view = events.page_view;
        var block_marker = new views.BlockMarker(page_view);
        block_marker.show();
    };

    events.on_block_marker_hide = function() {
        var page_view = events.page_view;
        var block_marker = page_view.block_marker;
        block_marker.hide();
    };

    events.on_block_add = function(block_text) {
        var page = events.page;

        page.block_list.insert({ text: block_text }, function(block) {
            events.on_block_show(block.id(), function(block_id) {
                events.on_block_comments_show(block_id);
            });
        });
    };

    events.on_block_update = function(block_id, new_block_id) {
        new_block_id = new_block_id || block_id;

        var page_view = events.page_view;
        var block_view = page_view.blocks[block_id];
        var block_comments_visible = block_view.block_comments && block_view.block_comments.visible();

        events.on_block_hide(block_id);
        events.on_block_show(new_block_id);

        if (block_comments_visible)
            events.on_block_comments_show(new_block_id);
    };

    events.on_user_login = function(username, password, done) { //TODO remove
        var objects = model.objects;

        objects.user.login(username, password, function() {
            done && done(settings.post, settings.auth);
        });
    };

    events.on_user_logout = function(done) { //TODO remove
        var objects = model.objects;

        objects.user.logout(function() {
            done && done(settings.post, settings.auth);
        });
    };

    events.on_user_register = function(username, password, done) { //TODO remove
        var objects = model.objects;

        objects.user.register(username, password, function() {
            done && done(settings.post, settings.auth);
        });
    };

    events.on_user_login_service = function(done) { //TODO remove
        var objects = model.objects;

        objects.user.login_service(function() {
            done && done(settings.post, settings.auth);
        });
    };

    events.format_block = function(block) {
        return {
            id: block.id(),
            text: block.text(),
            comment_count: block.comment_count()
        };
    };

    events.format_comment = function(comment, author) {
        return {
            id: comment.id(),
            date: comment.date(),
            text: comment.text(),
            author: {
                id: author.id(),
                username: author.username()
            }
        };
    };

});