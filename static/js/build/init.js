goog.provide('commentum.init');
goog.require('commentum.events');
goog.require('commentum.settings');
goog.require('commentum.utils');

goog.scope(function() {
    var init = commentum.init;
    var events = commentum.events;
    var settings = commentum.settings;
    var utils = commentum.utils;

    init.start = function(server, url, post) {
        settings.host = server.host;
        settings.path = server.service;
        settings.post = post;

        events.on_page_load(url);
    };

    goog.exportSymbol('script_main', utils.bind(init.start, init));
});