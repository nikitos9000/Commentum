goog.provide('commentum.frame');
goog.require('commentum.frame_events');
goog.require('commentum.settings');

goog.scope(function() {
    var frame = commentum.frame;
    var events = commentum.frame_events;
    var settings = commentum.settings;

    frame.start = function(server, data) {
        settings.host = server.host;
        settings.path = server.service;
        settings.post = true;

        events.on_page_load(data.result);
    };

    goog.exportSymbol('script_frame', function(server, data) {
        frame.start(server, data);
    });
});