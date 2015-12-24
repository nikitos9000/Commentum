goog.provide('commentum.utils');

goog.scope(function() {
	var utils = commentum.utils;

    utils.foreach = function(array, callback) {
        if (array instanceof Array) {
            for (var i = 0; i < array.length; ++i) {
                callback(array[i]);
            }
        } else {
            for (var key in array) {
                if (array.hasOwnProperty(key)) {
                    callback(key, array[key]);
                }
            }
        }
    };

    utils.bind = function(function_value, this_value, function_arguments) {
        return function() {
            return function_value.apply(this_value || this, function_arguments || arguments);
        };
    };

    utils.apply = function(function_factory, this_value) {
        return function() {
            var function_value = function_factory();
            return function_value && function_value.apply(this_value || this, arguments);
        };
    };

    utils.empty = function(array) {
        if (array instanceof Array)
            return array.length == 0;

        if (array instanceof Object)
            for (var key in array)
                if (array[key]) return false;

        return true;
    };
});