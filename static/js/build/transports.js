goog.provide('commentum.transports');
goog.require('commentum.settings');
goog.require('commentum.utils');

goog.require('goog.Uri');
goog.require('goog.net.XhrIo');
goog.require('goog.net.Jsonp');

//
goog.require('goog.window');
goog.require('goog.dom');

goog.scope(function() {
    var transport = commentum.transports;
    var settings = commentum.settings;

    var AJAX = goog.net.XhrIo;
    var AJAXCall = goog.net.Jsonp;
    var QueryData = goog.Uri.QueryData;

    transport.ajax_transport = function(action, post, request_data, result_function) {
        var url = '/' + settings.path + '/' + action + '.json';

        if (settings.host)
            url = 'http://' + settings.host + url;

        var request = new QueryData();
        for (var request_key in request_data) {
            var request_value = request_data[request_key];
            if (request_value) request.add(request_key, request_value);
        }

        var result = function(result_event) {
            result_function(result_event.target.getResponseJson());
        };

        if (post) {
            AJAX.send(url, result, "POST", request.toString());
        } else {
            AJAX.send(url + '?' + request.toString(), result, "GET");
        }

        return true;
    };

    transport.ajax_call_transport = function(action, post, request_data, result_function) {
        if (post) return false;

        var url = '/' + settings.path + '/' + action + '.jsoncall';

        if (settings.host)
            url = 'http://' + settings.host + url;

        var request = new Object();
        for (var request_key in request_data) {
            var request_value = request_data[request_key];
            if (request_value) request[request_key] = request_value;
        }

        var ajaxCall = new AJAXCall(url);
        ajaxCall.send(request, result_function);

        return true;
    };

    transport.data_view = function(action, object, request_data, result_function) {
        var request = new QueryData();
        for (var request_key in request_data) {
            var request_value = request_data[request_key];
            if (request_value) request.add(request_key, request_value);
        }

        var request_url = 'http://' + settings.host + "/" + settings.path + '/' + action + '.view' + '?' + request.toString();

        object.send(action, request_url, result_function);

        return true;
    };

    transport.data_popup = function(action, request_data, result_function) {
        var request = new QueryData();
        for (var request_key in request_data) {
            var request_value = request_data[request_key];
            if (request_value) request.add(request_key, request_value);
        }

        var request_url = 'http://' + settings.host + "/" + settings.path + '/' + action + '.view' + '?' + request.toString();

        window.script_popup_return = result_function;

        goog.window.open(request_url, {
            'resizeable': 'yes',
            'location': 'yes',
            'scrollbars': 'yes',
            'width': 400,
            'height': 200
        });
    };
});