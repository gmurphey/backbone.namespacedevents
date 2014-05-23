/* globals exports, require, describe, it */
/* jslint loopfunc: true */
if (typeof(exports) !== "undefined") {
  var Backbone = require("backbone");
  var sinon = require("sinon");

  require("../../backbone.namespacedevents");
  require("should");
}

var modules = ["Model", "Collection", "View"],
    jquery_methods = {
      find: sinon.stub(),
      attr: sinon.stub()
    };

Backbone.$ = sinon.stub().returns(jquery_methods);

describe("Backbone", function () {
  it("should expose the NamespacedEvent module", function () {
    Backbone.should.have.property("NamespacedEvent");
  });

  describe("NamespacedEvent", function () {
    for (var i = 0; i < modules.length; i++) {
      var module = modules[i];

      it ("should expose the " + module + " module", function () {
        Backbone.NamespacedEvent.should.have.property(module);
      });

      describe(module, function () {
        describe("prototype.initialize", function () {
          it("should set an eventNamespace property when an option is passed to the method", function () {
            var options = {
              eventNamespace: "namespace"
            },
            test = new Backbone.NamespacedEvent[module](options);

            test.eventNamespace.should.eql(options.eventNamespace);
          });

          it("should overwrite an existing eventNamespace property when an option is passed to the method", function () {
            var TestObject = Backbone.NamespacedEvent[module].extend({
              eventNamespace: "old-namespace"
            }),
            options = {
              eventNamespace: "new-namespace"
            },
            test = new TestObject(options);

            test.eventNamespace.should.eql(options.eventNamespace);
          });
        });

        describe("prototype.trigger", function () {
          it("should not fire a trigger on Backbone.Events when an eventNamespace property is not defined", function () {
            var TestObject = Backbone.NamespacedEvent[module].extend(),
              test = new TestObject();

            sinon.stub(Backbone.Events, "trigger");

            test.trigger("test-trigger");

            Backbone.Events.trigger.callCount.should.eql(0);
            Backbone.Events.trigger.restore();
          });

          it("should fire a trigger on Backbone.Events when an eventNamespace property is defined", function (done) {
            var TestObject = Backbone.NamespacedEvent[module].extend({
              eventNamespace: "test-namespace"
            }),
            test = new TestObject();

            Backbone.Events.once("test-namespace:test-trigger", function () {
              done();
            });

            test.trigger("test-trigger");
          });
        });
      });
    }
  });
});
