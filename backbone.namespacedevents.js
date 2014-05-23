/* globals define: false, exports: true, require: false */
(function (root, factory) {
  if (typeof(define) === 'function' && define.amd) {
    define(['backbone', 'underscore'], function (Backbone, _) {
      factory(Backbone, _);
    });
  } else if (typeof(exports) !== 'undefined') {
    var Backbone = require('backbone'),
      _ = require('underscore');

    factory(Backbone, _);
  } else {
    factory(root.Backbone, root._);
  }
} (this, function (Backbone, _) {
  var NamespacedEventModules = {},
      modules = ['Model', 'Collection', 'View'];

  _.each(modules, function (module) {
    NamespacedEventModules[module] = Backbone[module].extend({
      initialize: function (options) {
        var overridable_properties = ['eventNamespace'];

        _.extend(this, _.pick(options || {}, overridable_properties));

        Backbone[module].prototype.initialize.apply(this, arguments);
      },

      trigger: function () {
        var args = arguments;

        Backbone[module].prototype.trigger(this, args);

        if (this.eventNamespace && args.length) {
          args[0] = [this.eventNamespace, args[0]].join(':');
          Backbone.Events.trigger.apply(Backbone.Events, args);
        }

        return this;
      }
    });
  });

  _.extend(Backbone, {
    NamespacedEvent: NamespacedEventModules
  });
}));
