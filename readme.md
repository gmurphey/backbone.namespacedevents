# Backbone.NamespacedEvents

A Backbone.js extension meant to clean up global event pollution.

The goal of this extension is to cut down on generic global Backbone.Event triggers and promote namespacing of events that are fired globally.

## Getting Started

To install:

Node: `npm install --save backbone.namespacedevents`
Bower: `bower install --save backbone.namespacedevents`

After you've included the plugin on your page or in your module, you can start using it.

``` javascript
var NSE_View = Backbone.View.extend({
  eventNamespace: 'NSE_View',

  render: function () {
    this.trigger('render');
    this.trigger('rendered');

    return this;
  };
});
```

When the `render` and `rendered` events are fired within the `NSE_View`, `Backbone.Events` will trigger `NSE_View:render` and `NSE_View:rendered`, respectively.
