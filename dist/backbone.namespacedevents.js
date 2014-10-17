/*! backbone.namespacedevents - v1.0.0 - 2014-10-16
* Copyright (c) 2014 Garrett Murphey <gmurphey@gmurphey.com> (http://gmurphey.com); Licensed ISC */
/*! backbone.namespacedevents - v1.0.1 - 2014-10-16
* Copyright (c) 2014 Garrett Murphey <gmurphey@gmurphey.com> (http://gmurphey.com); Licensed ISC */
/* global define, exports, require */
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
      },

      localTrigger: Backbone[module].prototype.trigger,

      trigger: function () {
        var args = arguments;

        Backbone[module].prototype.localTrigger.apply(this, args);

        if (this.eventNamespace && args.length) {
          args[0] = [this.eventNamespace, args[0]].join(':');
          Backbone.Events.trigger.apply(Backbone.Events, args);
        }

        return this;
      }
    });
  });

  _.extend(Backbone, NamespacedEventModules);
}));
