goog.provide('commentum.framework');

goog.scope(function() {
	var framework = commentum.framework;

	framework.field = function() {
		return new framework.objects.Field();
	};

	framework.relation = function(type, actions) {
		return new framework.objects.Relation(type, actions);
	};

	framework.relations = function(type, actions) {
		return new framework.objects.Relations(type, actions);
	};

	framework.factory = function(definition) {
		definition = definition || {};

		return function(object) {
			object = object || {};
			for (var key in definition) {
				var value = definition[key];

				if (value instanceof framework.objects.Field)
					this[key] = framework.utils.get(object, key);

				if (value instanceof framework.objects.Relation || 
					value instanceof framework.objects.Relations) {
					var actions = {};
					for (var actionKey in value.actions)
						actions[actionKey] = framework.utils.action(value.actions[actionKey], value.type, this);
					this[key] = actions;
				}
			}
			this.object = object;
		};
	};

	framework.utils = {
		action: function(action, type, object) {
			return function() {
				var parameters = [];
				for (var i = 0; i < arguments.length - 1; ++i) {
					var parameter = arguments[i];
					if (parameter.object)
						parameter = parameter.object;
					parameters.push(parameter);
				}
				parameters.push(framework.utils.callback(type, arguments[arguments.length - 1]));
				return action.apply(object, parameters);
			}
		},

		callback: function(type, callback) {
			return function(object, multiple) {
				if (object instanceof Array) {
					var array = [];
					for (var i = 0; i < object.length; ++i)
						array[i] = new type(object[i]);
					object = array;
				} else if (object instanceof Object && multiple) {
					var array = {};
					for (var key in object) 
						array[key] = new type(object[key]);
					object = array;
				} else if (object instanceof Object) {
					object = new type(object);
				}
				callback(object);
			};
        },

        get: function(object, key) {
            return function() {
                return object[key];
            }
        }
	};

	framework.objects = {
		Field: function() {
		},

		Relation: function(type, actions) {
			this.type = type;
			this.actions = actions;
		},

		Relations: function(type, actions) {
			this.type = type;
			this.actions = actions;
		}
	};
});