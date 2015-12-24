goog.provide('commentum.views');
goog.require('commentum.templates');
goog.require('commentum.strings');
goog.require('commentum.utils');
goog.require('goog.array');
goog.require('goog.style');
goog.require('goog.date');
goog.require('goog.dom');
goog.require('goog.dom.annotate');
goog.require('goog.dom.classes');
goog.require('goog.dom.Range');
goog.require('goog.events');
goog.require('goog.json');
goog.require('goog.net.xpc');
goog.require('goog.net.xpc.CrossPageChannel');
goog.require('goog.string');

goog.scope(function() {
    var views = commentum.views;
    var templates = commentum.templates;
    var strings = commentum.strings;
    var utils = commentum.utils;

    views.Page = function(id) {
        this.page_id = id;
        this.blocks = {};

        this.id = function() {
            return "page" + this.page_id;
        };

        this.comments_id = function() {
            return this.id() + "_content";
        };

        this.show_comments_id = function() {
            return this.id() + "_show_comments";
        };

        this.show = function() {
            var self = this;

            var page_element = soy.renderAsFragment(templates.Page, { page: {
                panelId: this.id(),
                commentsId: this.comments_id(),
                commentsShowId: this.show_comments_id()
            }});

            goog.dom.appendChild(document.body, page_element);

            var page_comments_toggle = goog.dom.getElement(this.show_comments_id());

            goog.events.listen(page_comments_toggle, goog.events.EventType.CLICK, function() {
                if (self.page_comments && self.page_comments.visible()) {
                    views.events.on_page_comments_hide();
                } else {
                    views.events.on_page_comments_show();
                }
            });
        };

        this.hide = function() {
            goog.dom.removeNode(goog.dom.getElement(this.id()));
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };
    };

    views.Block = function(page, block) {
        this.page = page;
        this.block_id = block.id;
        this.block_text = block.text;
        this.block_comment_count = block.comment_count;

        this.id = function() {
            return this.page.id() + "_block" + this.block_id;
        };

        this.hint_id = function() {
            return this.id() + "_hint";
        };

        this.hint_span_id = function() {
            return this.id() + "_hint_span";
        };

        this.comment_count_id = function() {
            return this.id() + "_comment_count";
        };

        this.show = function() {
            if (!this.visible()) {
                var self = this;
                /*
                 var block_info = goog.json.parse(this.block_text);

                 var node = document;
                 for (var i = block_info.path.length - 1; i >= 0; --i) {
                 var block_path_entry = block_info.path[i];
                 node = goog.dom.getChildren(node)[block_path_entry.index];
                 }*/

                //node
                goog.dom.annotate.annotateTerms(document.body, [
                    [this.block_text, false]
                ], function(index, content) {
                    if (goog.dom.getElement(self.id()))
                        return content;

                    return templates.Block({ block: {
                        id: self.id(),
                        hintId: self.hint_id(),
                        hintSpanId: self.hint_span_id(),
                        content: content,
                        commentCountId: self.comment_count_id(),
                        commentCount: self.block_comment_count
                    }, strings: strings
                    });
                });

                var block_element = goog.dom.getElement(this.id());

                if (!block_element) return false;

                goog.events.listen(block_element, goog.events.EventType.MOUSEOVER, utils.bind(this.show_highlight, this));
                goog.events.listen(block_element, goog.events.EventType.MOUSEOUT, utils.bind(this.hide_highlight, this));

                goog.events.listen(block_element, goog.events.EventType.CLICK, function() {
                    if (self.block_comments && self.block_comments.visible()) {
                        views.events.on_block_comments_hide(self.block_id);
                    } else {
                        views.events.on_block_comments_show(self.block_id);
                    }
                });
            }

            this.page.blocks[this.block_id] = this;
        };

        this.hide = function() {
            delete this.page.blocks[this.block_id];

            if (this.visible()) {
                var block_element = goog.dom.getElement(this.id());
                var parent_element = goog.dom.getParentElement(block_element);

                goog.dom.flattenElement(block_element);
                parent_element.normalize();

                goog.dom.removeNode(goog.dom.getElement(this.hint_span_id()));
            }
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };

        this.show_highlight = function() {
            var block_element = goog.dom.getElement(this.id());
            var block_hint_element = goog.dom.getElement(this.hint_span_id());

            goog.dom.classes.add(block_element, "block_info_selected");
            goog.dom.classes.add(block_hint_element, "block_info_hint_selected");
        };

        this.hide_highlight = function() {
            if (!(this.block_comments && this.block_comments.visible())) {
                var block_element = goog.dom.getElement(this.id());
                var block_hint_element = goog.dom.getElement(this.hint_span_id());

                goog.dom.classes.remove(block_element, "block_info_selected");
                goog.dom.classes.remove(block_hint_element, "block_info_hint_selected");
            }
        };

        this.update = function() {
            var comment_count_element = goog.dom.getElement(this.comment_count_id());
            var new_comment_count_element = soy.renderAsElement(templates.BlockCommentCount, { block: {
                commentCountId: this.comment_count_id(),
                commentCount: this.block_comment_count
            }, strings: strings});

            goog.dom.replaceNode(new_comment_count_element, comment_count_element);
        };
    };

    views.BlockComments = function(block) {
        this.block = block;
        this.comments = {};

        this.id = function() {
            return this.block.id() + "_comments";
        };

        this.comments_id = function() {
            return this.id() + "_entries";
        };

        this.comments_post_id = function() {
            return this.id() + "_post";
        };

        this.show = function() {
            var block_element = goog.dom.getElement(this.block.id());

            var block_comments_element = soy.renderAsFragment(templates.BlockComments, {
                block_comments: {
                    id: this.id(),
                    commentsId: this.comments_id(),
                    commentsPostId: this.comments_post_id()
                }
            });

            goog.dom.insertSiblingBefore(block_comments_element, block_element);

            goog.events.listen(block_comments_element, [goog.events.EventType.MOUSEDOWN, goog.events.EventType.MOUSEUP], function(event) {
                event.stopPropagation();
            });

            this.block.block_comments = this;

            this.block.show_highlight(); //TODO: do smth
        };

        this.hide = function() {
            delete this.block.block_comments;

            goog.dom.removeNode(goog.dom.getElement(this.id()));

            this.block.hide_highlight(); //TODO: do smth
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };
    };

    views.PageComments = function(page) {
        this.page = page;
        this.comments = {};

        this.id = function() {
            return page.id() + "_comments";
        };

        this.comments_id = function() {
            return this.id() + "_entries";
        };

        this.comments_post_id = function() {
            return this.id() + "_post";
        };

        this.show = function() {
            var page_element = goog.dom.getElement(this.page.comments_id());

            var page_comments_element = soy.renderAsFragment(templates.PageComments, {
                page_comments: {
                    id: this.id(),
                    commentsId: this.comments_id(),
                    commentsPostId: this.comments_post_id()
                }
            });

            goog.dom.appendChild(page_element, page_comments_element);

            goog.events.listen(page_comments_element, [goog.events.EventType.MOUSEDOWN, goog.events.EventType.MOUSEUP], function(event) {
                event.stopPropagation();
            });

            this.page.page_comments = this;
        };

        this.hide = function() {
            delete this.page.page_comments;

            goog.dom.removeNode(goog.dom.getElement(this.id()));
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };
    };

    views.Comment = function(object_comments, comment) {
        this.object_comments = object_comments;
        this.comment = comment;

        this.id = function() {
            return this.object_comments.id() + "_comment" + this.comment.id;
        };

        this.key = function() {
            return this.comment.date;
        };

        this.show = function() {
            var abstract_comments_element = goog.dom.getElement(this.object_comments.comments_id());

            var comment_element = soy.renderAsFragment(templates.Comment, { comment: {
                id: this.comment.id,
                date: this.format_date(this.comment.date),
                text: this.comment.text,
                author: {
                    id: this.comment.author.id,
                    username: this.comment.author.username
                }
            }});

            var key = this.key();

            var next_comment = goog.array.find(this.object_comments.comments, function(value) {
                return value.key() > key;
            });

            if (next_comment) {
                var next_comment_element = goog.dom.getElement(next_comment.id());
                goog.dom.insertSiblingBefore(comment_element, next_comment_element);
            } else {
                goog.dom.appendChild(abstract_comments_element, comment_element);
            }

            this.object_comments.comments[this.comment.id] = this;
        };

        this.hide = function() {
            delete this.object_comments.comments[this.comment.id];

            goog.dom.removeNode(goog.dom.getElement(this.id()));
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };

        this.format_date = function(timestamp) {
            var datetime = new goog.date.DateTime(new Date(timestamp * 1000));

//            var month_list = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//            var date_at = 'at';

            var month_list = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
            var date_at = 'в';

            return goog.getMsg("{$day} {$month} {$year} {$at} {$hour}:{$minute}", {
                day: goog.string.padNumber(datetime.getDate(), 2),
                month: month_list[datetime.getMonth()],
                year: goog.string.padNumber(datetime.getYear() % 100, 2),
                at: date_at,
                hour: goog.string.padNumber(datetime.getHours(), 2),
                minute: goog.string.padNumber(datetime.getMinutes(), 2)
            });
        };
    };

    views.BlockComment = function(block_comments, comment) {
        views.Comment.call(this, block_comments, comment);
    };

    views.PageComment = function(page_comments, comment) {
        views.Comment.call(this, page_comments, comment);
    };

    views.CommentPostForm = function(object_comments, on_comment_post) {
        this.object_comments = object_comments;
        this.on_comment_post = on_comment_post;

        this.id = function() {
            return this.object_comments.id() + "_comment_post";
        };

        this.text_id = function() {
            return this.id() + "_text";
        };

        this.submit_id = function() {
            return this.id() + "_submit";
        };

        this.show = function() {
            var object_comments_post = goog.dom.getElement(this.object_comments.comments_post_id());

            var comment_post = soy.renderAsFragment(templates.CommentPost, {
                comment_post: {
                    id: this.id(),
                    textId: this.text_id(),
                    submitId: this.submit_id()
                },
                strings: strings
            });

            goog.dom.appendChild(object_comments_post, comment_post);

            var comment_post_submit = goog.dom.getElement(this.submit_id());

            var self = this;

            goog.events.listen(comment_post_submit, goog.events.EventType.CLICK, function() {
                var comment_post_text = goog.dom.getElement(self.text_id());

                var comment = {
                    text: comment_post_text.value
                };

                self.on_comment_post(comment, function() {
                    comment_post_text.value = "";
                });
            });
        };

        this.hide = function() {
            delete this.object_comments.comment_post;

            return goog.dom.removeNode(goog.dom.getElement(this.id()));
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };
    };

    views.CommentPostAuth = function(object_comments, on_comment_post_update) {
        this.object_comments = object_comments;
        this.on_comment_post_update = on_comment_post_update;

        this.id = function() {
            return this.object_comments.id() + "_comment_post";
        };

        this.login_id = function() {
            return this.id() + "_login";
        };

        this.password_id = function() {
            return this.id() + "_password";
        };

        this.signin_id = function() {
            return this.id() + "_signin";
        };

        this.signup_id = function() {
            return this.id() + "_signup";
        };

        this.login_service_id = function() {
            return this.id() + "_service_";
        };

        this.show = function() {
            var object_comments_post = goog.dom.getElement(this.object_comments.comments_post_id());

            var login_services = [ 'facebook', 'twitter', 'google', 'vkontakte' ];

            var comment_post = soy.renderAsFragment(templates.CommentPostAuth, {
                comment_post: {
                    id: this.id(),
                    signInId: this.signin_id(),
                    signUpId: this.signup_id(),
                    loginId: this.login_id(),
                    passwordId: this.password_id(),
                    loginServiceId: this.login_service_id(),
                    loginServices: login_services
                },
                strings: strings
            });

            goog.dom.appendChild(object_comments_post, comment_post);

            var self = this;

            var comment_post_signin = goog.dom.getElement(this.signin_id());

            goog.events.listen(comment_post_signin, goog.events.EventType.CLICK, function() {
                var comment_post_login = goog.dom.getElement(self.login_id());
                var comment_post_password = goog.dom.getElement(self.password_id());

                views.events.on_user_login(comment_post_login.value, comment_post_password.value, self.on_comment_post_update);
            });

            var comment_post_signup = goog.dom.getElement(this.signup_id());

            goog.events.listen(comment_post_signup, goog.events.EventType.CLICK, function() {
                var comment_post_login = goog.dom.getElement(self.login_id());
                var comment_post_password = goog.dom.getElement(self.password_id());

                views.events.on_user_register(comment_post_login.value, comment_post_password.value, self.on_comment_post_update);
            });

            utils.foreach(login_services, function(login_service) {
                var login_service_element = goog.dom.getElement(self.login_service_id() + login_service);

                goog.events.listen(login_service_element, goog.events.EventType.CLICK, function() {
                    views.events.on_user_login_service(login_service, self.on_comment_post_update);
                });
            });

            this.object_comments.comment_post = this;
        };

        this.hide = function() {
            delete this.object_comments.comment_post;

            return goog.dom.removeNode(goog.dom.getElement(this.id()));
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };
    };

    views.CommentPostFrame = function(object_comments, on_comment_post) {
        this.object_comments = object_comments;
        this.on_comment_post = on_comment_post;

        this.id = function() {
            return this.object_comments.id() + "_comment_post";
        };

        this.frame_id = function() {
            return this.id() + "_frame";
        };

        this.splash_id = function() {
            return this.id() + "_splash";
        };

        this.frame_init = function(frame_element) {
            goog.dom.classes.add(frame_element, "comment_post_frame");
            goog.dom.classes.add(frame_element, "comment_width");
            frame_element.frameBorder = "0";
            frame_element.scrolling = "no";
        };

        this.FrameObject = function(view, frame, callbacks) {
            this.view = view;
            this.frame = frame;

            this.send = function(action, url, callback) {
                if (this.channel) this.close();

                var channel_config = { };
                channel_config[goog.net.xpc.CfgFields.PEER_URI] = url;
                channel_config[goog.net.xpc.CfgFields.IFRAME_ID] = this.view.frame_id();

                var channel = new goog.net.xpc.CrossPageChannel(channel_config);

                utils.foreach(callbacks, function(service, callback) {
                    channel.registerService(service, function(data) {
                        callback(goog.json.parse(data));
                    });
                });

                channel.registerService(action, function(data) {
                    callback(goog.json.parse(data));
                });

                channel.createPeerIframe(this.frame, utils.bind(this.view.frame_init, this.view));

                channel.connect();

                this.channel = channel;
            };

            this.close = function() {
                if (this.channel)
                    this.channel.close();

                delete this.channel;
            };
        };

        this.show = function() {
            var object_comments_post = goog.dom.getElement(this.object_comments.comments_post_id());

            var comment_post = soy.renderAsFragment(templates.CommentPostFrame, { comment_post: {
                id: this.id(),
                splashId: this.splash_id()
            }});

            goog.dom.appendChild(object_comments_post, comment_post);

            var self = this;
            var frame_callbacks = {
                'set_height': function(data) {
                    var frame_element = goog.dom.getElement(self.frame_id());
                    goog.style.setHeight(frame_element, data.height);

                    var splash_element = goog.dom.getElement(self.splash_id());
                    goog.style.showElement(splash_element, false);
                }
            };

            this.frame_object = new this.FrameObject(this, comment_post, frame_callbacks);

            this.object_comments.comment_post = this;

            this.on_comment_post(this.frame_object);
        };

        this.hide = function() {
            delete this.object_comments.comment_post;

            if (this.frame_object) {
                this.frame_object.close();
                delete this.frame_object;
            }

            return goog.dom.removeNode(goog.dom.getElement(this.id()));
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };
    };

    views.CommentPost = function(object_comments, post, auth, on_comment_post) {
        this.object_comments = object_comments;
        this.on_comment_post = on_comment_post;

        this.id = function() {
            return this.comment_post.id();
        };

        this.on_comment_post_update = function(post, auth) {
            this.hide();
            this.update(post, auth);
            this.show();
        };

        this.show = function() {
            if (this.comment_post)
                this.comment_post.show();
        };

        this.hide = function() {
            if (this.comment_post)
                this.comment_post.hide();
        };

        this.visible = function() {
            return this.comment_post && this.comment_post.visible();
        };

        this.update = function(post, auth) {
            if (post != this.post || auth != this.auth) {
                this.post = post;
                this.auth = auth;

                delete this.comment_post;

                if (this.post) {
                    if (this.auth) {
                        this.comment_post = new views.CommentPostForm(this.object_comments, utils.bind(this.on_comment_post, this));
                    } else {
                        this.comment_post = new views.CommentPostAuth(this.object_comments, utils.bind(this.on_comment_post_update, this));
                    }
                } else {
                    this.comment_post = new views.CommentPostFrame(this.object_comments, utils.bind(this.on_comment_post, this));
                }
            }
        };

        this.update(post, auth);
    };

    views.BlockCommentPost = function(block_comments, post, auth) {
        var on_comment_post = function(comment, done) {
            views.events.on_page_block_comment_add(this.object_comments.block.block_id, comment, done);
        };
        views.CommentPost.call(this, block_comments, post, auth, on_comment_post);
    };

    views.PageCommentPost = function(page_comments, post, auth) {
        var on_comment_post = function(comment, done) {
            views.events.on_page_comment_add(comment, done);
        };
        views.CommentPost.call(this, page_comments, post, auth, on_comment_post);
    };

    views.BlockMarker = function(page) {
        this.page = page;

        this.id = function() {
            return this.page.id() + "_marker";
        };

        this.hint_id = function() {
            return this.id() + "_hint";
        };

        this.show = function() {
            var self = this;

            var marker_callback = function() {
                var block_marker_element = goog.dom.getElement(self.id());
                if (block_marker_element) {
                    var block_marker_parent_element = goog.dom.getParentElement(block_marker_element);
                    goog.dom.removeNode(block_marker_element);
                    block_marker_parent_element.normalize();
                }
            };

            this.event_key_clear = goog.events.listen(document, [
                goog.events.EventType.MOUSEDOWN, goog.events.EventType.MOUSEUP
            ], marker_callback);

            this.event_key = goog.events.listen(document, goog.events.EventType.MOUSEUP, function() {
                var range = goog.dom.Range.createFromWindow();
                var range_text = range.getText();

                var range_contains_block = false;

                utils.foreach(self.page.blocks, function(block_id, block_view) {
                    var block_element = goog.dom.getElement(block_view.id());
                    range_contains_block = range_contains_block || range.containsNode(block_element, true);
                }, true);

                if (range_text && !range_contains_block) {
                    self.text = range_text;

                    var block_marker_element = soy.renderAsElement(templates.BlockMarker, { block_marker: {
                        id: self.id(),
                        hintId: self.hint_id()
                    }, strings: strings
                    });

                    goog.events.listen(block_marker_element, goog.events.EventType.MOUSEUP, function(event) {
                        event.stopPropagation();
                    });

                    goog.events.listen(block_marker_element, goog.events.EventType.MOUSEDOWN, function(event) {
                        event.stopPropagation();
                    });

                    goog.events.listen(block_marker_element, goog.events.EventType.CLICK, function() {
                        if (self.text) {
                            views.events.on_block_add(self.text);
                            marker_callback();
                        }
                    });

                    range.insertNode(block_marker_element, false);

                    var node_path = [];

                    var node = goog.dom.getParentElement(range.getStartNode());

                    while (node && (!node.tagName || node.tagName.toLowerCase() != "html")) {
                        var parent = goog.dom.getParentElement(node);
                        var node_index = 0;

                        var parent_children = goog.dom.getChildren(parent);
                        for (var i = 0; i < parent_children.length; ++i) {
                            if (parent_children[i] == node)
                                node_index = i;
                        }

                        var node_entry = {
                            id: node.id || null,
                            tag: node.tagName || null,
                            index: node_index || null
                        };

                        node_path.push(node_entry);
                        node = parent;
                    }

                    self.info = {
                        path: node_path,
                        offset: range.getStartOffset(),
                        text: range.getText()
                    };

//                    alert(goog.json.serialize(node_info));
                }
            });

            this.page.block_marker = this;
        };

        this.hide = function() {
            delete this.page.block_marker;

            goog.dom.removeNode(goog.dom.getElement(this.id()));

            if (this.event_key) {
                goog.events.unlistenByKey(this.event_key);
                delete this.event_key;
            }

            if (this.event_key_clear) {
                goog.events.unlistenByKey(this.event_key_clear);
                delete this.event_key_clear;
            }
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };
    };

    views.FrameBlockComments = function(block_id) {
        this.block_id = block_id;
        this.block = { block_id: block_id };

        this.id = function() {
            return "block_comments";
        };

        this.comments_post_id = function() {
            return this.id() + "_comments_post";
        };

        this.show = function() {
            var block_comments_element = soy.renderAsFragment(templates.FrameBlockComments, { block_comments: {
                id: this.id(),
                commentsPostId: this.comments_post_id()
            }});

            goog.dom.appendChild(document.body, block_comments_element);
        };

        this.hide = function() {
            goog.dom.removeNode(goog.dom.getElement(this.id()));
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };

        this.height = function() {
            var block_comments_element = goog.dom.getElement(this.id());
            return block_comments_element && block_comments_element.scrollHeight;
        };
    };

    views.FramePageComments = function() {
        this.id = function() {
            return "page_comments";
        };

        this.comments_post_id = function() {
            return this.id() + "_comments_post";
        };

        this.show = function() {
            var page_comments_element = soy.renderAsFragment(templates.FramePageComments, { page_comments: {
                id: this.id(),
                commentsPostId: this.comments_post_id()
            }});

            goog.dom.appendChild(document.body, page_comments_element);
        };

        this.hide = function() {
            goog.dom.removeNode(goog.dom.getElement(this.id()));
        };

        this.visible = function() {
            return goog.dom.getElement(this.id()) != null;
        };

        this.height = function() {
            var page_comments_element = goog.dom.getElement(this.id());
            return page_comments_element && page_comments_element.scrollHeight;
        };
    };
});