goog.provide('commentum.model');
goog.require('commentum.actions');
goog.require('commentum.framework');
goog.require('commentum.settings');

goog.scope(function() {
    var model = commentum.model;
    var actions = commentum.actions;
    var framework = commentum.framework;
    var settings = commentum.settings;

    actions.hooks.push(function(data) {  // TODO: remove that shit
        settings.auth = data.auth;
    });

    model.utils = {
        find: function(array, select) {
            for (var i = 0; i < array.length; ++i) {
                var match = true;
                for (var key in select)
                    match = match && (array[i][key] == select[key]);
                if (match) return array[i];
            }
            return null;
        },

        assign: function(array, select) {
            for (var i = 0; i < array.length; ++i) {
                for (var key in select)
                    array[i][key] = select[key];
            }
            return array;
        },

        is_empty: function(key) {
            for (var i in key) {
                if (key[i])
                    return false;
            }
            return true;
        }
    };

    model.User = framework.factory({
        id: framework.field(),
        username: framework.field()
    });

    model.Comment = framework.factory({
        id: framework.field(),
        date: framework.field(),
        text: framework.field(),

        reply: framework.relation(model.Comment),

        author: framework.relation(model.User, {
            set: function(author, callback) {
                var object = this.object;
                object.author = author;
                object.author.comment = object;
                callback(object.author);
            },

            get: function(callback) {
                var object = this.object;
                callback(object.author);
            }
        })
    });

    model.Block = framework.factory({
        id: framework.field(),
        text: framework.field(),
        comment_count: framework.field(),

        comment_list: framework.relations(model.Comment, {
            insert: function(comment, callback) {
                var object = this.object;
                actions.add_page_block_comment(object.page, object, comment, function(data) {
                    if (!data.result)
                        return callback(null);

                    var page_id = data.result.page_id;
                    var block_id = data.result.block_id;

                    if (object.id != block_id) {
                        object.id = block_id;
                    }

                    if (object.page.id != page_id) {
                        object.page.id = page_id;
                    }

                    object.comment_count++;

                    var comment = data.result.comment;
                    comment.block = object;

                    if (object.comment_list)
                        object.comment_list.push(comment);
                    callback(comment);
                });
            },

            remove: function(comment, callback) {

            },

            get: function(key, callback) {
                var object = this.object;

                if (object.comment_list)
                    return callback(model.utils.find(object.comment_list, key));

                actions.get_page_block_comments(object.page, object, function(data) {
                    if (!data.result)
                        return callback(null);

                    object.comment_list = data.result.comment_list;
                    object.comment_list = model.utils.assign(object.comment_list, { block: object });
                    callback(model.utils.find(object.comment_list, key));
                });
            },

            getAll: function(callback) {
                var object = this.object;

                if (object.comment_list)
                    return callback(object.comment_list);

                actions.get_page_block_comments(object.page, object, function(data) {
                    if (!data.result)
                        return callback(null);

                    object.comment_list = data.result.comment_list;
                    object.comment_list = model.utils.assign(object.comment_list, { block: object });
                    callback(object.comment_list);
                });
            }
        })
    });

    model.Page = framework.factory({
        id: framework.field(),
        url: framework.field(),
        comment_count: framework.field(),

        block_list: framework.relations(model.Block, {
            insert: function(block, callback) {
                var object = this.object;

                block.id = block.id || 0;
                block.text = block.text || "";
                block.comment_count = block.comment_count || 0;
                block.comment_list = block.comment_list || [];
                block.page = object;
                block.is_new = true;

                var existing_block = model.utils.find(object.block_list, { is_new: true });

                if (existing_block) {
                    var index = object.block_list.indexOf(existing_block);
                    object.block_list[index] = block;
                } else {
                    object.block_list.push(block); //TODO fix
                }

                callback(block);
            },

            get: function(key, callback) {
                var object = this.object;
                var block = model.utils.find(object.block_list, key);
                if (block) block.page = object;
                callback(block);
            },

            getAll: function(callback) {
                var object = this.object;
                object.block_list = model.utils.assign(object.block_list, { page: object });
                callback(object.block_list);
            }
        }),

        comment_list: framework.relations(model.Comment, {
            insert: function(comment, callback) {
                var object = this.object;

                actions.add_page_comment(object, comment, function(data) {
                    if (!data.result) callback(null);

                    var page_id = data.result.page_id;

                    if (object.id != page_id) {
                        object.id = page_id;
                    }

                    object.comment_count++;

                    var comment = data.result.comment;
                    comment.page = object;

                    if (object.comment_list)
                        object.comment_list.push(comment);

                    callback(comment);
                });
            },

            remove: function(comment, callback) {

            },

            get: function(key, callback) {
                var object = this.object;

                if (object.comment_list)
                    callback(model.utils.find(object.comment_list, key));

                actions.get_page_comments(object, function(data) {
                    if (!data.result)
                        return callback(null);

                    object.comment_list = data.result.comment_list;
                    object.comment_list = model.utils.assign(object.comment_list, { page: object });
                    callback(model.utils.find(object.comment_list, key));
                });
            },

            getAll: function(callback) {
                var object = this.object;

                if (object.comment_list)
                    return callback(object.comment_list);

                actions.get_page_comments(object, function(data) {
                    if (!data.result)
                        return callback(null);

                    object.comment_list = data.result.comment_list;
                    object.comment_list = model.utils.assign(object.comment_list, { page: object });
                    callback(object.comment_list);
                });
            }
        })
    });

    model.All = framework.factory({
        page_list: framework.relations(model.Page, {
            insert: function(page, callback) {
                var object = this.object;

                page.id = page.id || 0;
                page.url = page.url || "";
                page.comment_count = page.comment_count || 0;
                page.block_list = page.block_list || [];
                page.comment_list = page.comment_list || [];
                page.objects = object;

                object.page_list = [page]; //TODO fix

                callback(page);
            },

            get: function(key, callback) {
                var object = this.object;

                if (object.page_list)
                    return callback(model.utils.find(object.page_list, key));

                actions.get_page_info(key, function(data) {
                    if (!data || !data.result)
                        return callback(null);

                    object.page_list = [data.result];
                    object.page_list = model.utils.assign(object.page_list, { url: key.url, objects: object });
                    callback(model.utils.find(object.page_list, key));
                });
            }
        }),

        user: framework.relation(model.User, {
            register: function(username, password, callback) {
                actions.register_user(username, password, function(data) {
                    callback(data.result);
                });
            },

            login: function(username, password, callback) {
                actions.login_user(username, password, function(data) {
                    callback(data.result);
                });
            },

            logout: function(callback) {
                actions.logout_user(function(data) {
                    callback(data.result);
                });
            },

            login_service: function(service, callback) {
                actions.login_user_service(service, function(data) {
                    callback(data.result);
                });
            }
        })
    });

    model.objects = new model.All();
});