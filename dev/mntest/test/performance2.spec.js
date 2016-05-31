import expect from 'expect.js';
import StubLoader from './StubLoader.js';
import Bus from './Bus.js';
import Util from './Util.js';

let ServiceFramework = require('service-framework');
let MessageFactory = new ServiceFramework.MessageFactory(false, {});

describe('messaging object update performance for different number of subscribers', function() {
  this.timeout(1000000);

  let stubLoader = new StubLoader();
  let stubConfig = stubLoader.config;
  let util = new Util();

  let msgNodeAddress = "domain://msg-node." + stubConfig.domain;
  let address;

  let runtimeURLReporter     = "runtime://" + stubConfig.domain + "/Reporter";
  let runtimeStubURLReporter = 'hyperty-runtime://' + stubConfig.domain + '/protostub/Reporter';
  let stubReporter;
  let busReporter;

  let runtimeURLSubscriber     = "runtime://" + stubConfig.domain + "/Subscriber";
  let runtimeStubURLSubscriber = 'hyperty-runtime://' + stubConfig.domain + '/protostub/Subscriber';

  it('prepare: allocate object address', function(done) {

    busReporter = new Bus( (m, num) => {
      switch (num) {
        case 1:
          util.expectConnected(m, runtimeStubURLReporter);

          // not using MessageFactory, because it does not support "scheme"
          let msg = {
            // NOTE: According to the spec, id should be a String, but at least Vertx breaks if it really is --> relaxing test
            id: 1,
            type: "create",
            from: runtimeStubURLReporter + "/registry/allocation",
            to: msgNodeAddress + "/object-address-allocation",
            body: {
              scheme: "connection",
              value : {
                number: 1
              }
            }
          };
          busReporter.sendStubMsg(msg);
          break;

        case 2:
          // this message is expected to be the allocation response
          expect(m.id).to.eql("1");
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(msgNodeAddress + "/object-address-allocation");
          expect(m.to).to.eql(runtimeStubURLReporter + "/registry/allocation");
          expect(m.body.code).to.eql(200);
          expect(m.body.value.allocated.length).to.be(1);
          // remember object address
          address = m.body.value.allocated[0];

          // don't disconnect the Reporter Stub
          done();

        default:
      }
    },
    // enable / disable log of received messages
    false);

    stubReporter = stubLoader.activateStub(runtimeStubURLReporter, busReporter, runtimeURLReporter);
    stubReporter.connect();
  });


  let subscribe = (index) => {
    let msg;
    let bus;
    let stub;

    return new Promise((resolve, reject) => {
      bus = new Bus( (m, num) => {
        switch (num) {
          case 1:
            util.expectConnected(m, runtimeStubURLSubscriber + "/" + index);

            // NOTE: there is no support for a SubscribeMessageBody in the MessageFactory --> creating msg manually
            msg = {
              // NOTE: According to the spec, id should be a String, but at least Vertx breaks if it really is --> relaxing test
              id: 2,
              type: "subscribe",
              from: runtimeStubURLSubscriber + "/" + index + "/sm",
              to: msgNodeAddress + "/sm",
              body: {
                subscribe: [address + "/changes", address + "/children/name1"],
                source : runtimeStubURLSubscriber + index
              }
            };
            bus.sendStubMsg(msg);
            break;

          case 2:
            // this message is expected to be the subscription response
            expect(m.id).to.eql("2");
            expect(m.type.toLowerCase()).to.eql("response");
            expect(m.from).to.eql(msgNodeAddress + "/sm");
            expect(m.to).to.eql(runtimeStubURLSubscriber + "/" + index + "/sm");
            expect(m.body.code).to.eql(200);

            resolve(
              {
                bus : bus,
                stub : stub
              }
            );
            break;
          default:
        }
      },
      // enable / disable log of received messages
      false);

      stub = stubLoader.activateStub(runtimeStubURLSubscriber + "/" + index, bus, runtimeURLSubscriber + "/" + index);
      stub.connect();
    });
  }


  let checkEvent = (stub, bus, index) => {
    return new Promise((resolve, reject) => {
      bus.setStubMsgHandler((m, num) => {
        switch (num) {
          case 3:
            if ((index % 10) == 0 )
              console.log("event: " + index + " from: " + m.from);
            expect(m.type.toLowerCase()).to.eql("update");
            expect(m.from).to.eql(address);
            expect(m.to).to.eql(address + "/changes");
            expect(m.body.attribute).to.eql("changedAttribute");
            expect(m.body.value).to.eql("new Value");

            stub.disconnect();
            resolve();
            break;
          default:
        }
      },
      false);
    });
  }

  let testNSubscribers = (n, done) => {
    let subscribePromises = [];
    let eventPromises = [];
    let start, end;

    // subscribe N listeners --> receive promise for each
    for (var i = 0; i < n; i++) {
      // add console output to keep the test alive
      if ( (i % 10) == 0 )
        console.log("subscription: " + i);
      subscribePromises.push( subscribe(i) );
    }

    Promise.all( subscribePromises ).then( (subscribeResults) => {

      // install event-checker in each subscriber --> receive promise for each
      for (var i = 0; i < subscribeResults.length; i++) {
        eventPromises.push( checkEvent(subscribeResults[i].stub, subscribeResults[i].bus, i ) );
      }

      // test OK, if all eventCheckers resolve
      Promise.all( eventPromises ).then(() => {
        end = Date.now();
        console.log("TIME between sending of update-message and retrieval in all subscribers: " + (end - start) + " msecs");

        // disconnecting all stubs now
        let disconnectPromises = [];
        for (var i = 0; i < subscribeResults.length; i++) {
          // disconnectPromises.push( disconnectStub(subscribeResults[i].stub) );
          disconnectPromises.push( new Promise((resolve, reject) => {
              subscribeResults[i].stub.disconnect();
              resolve();
            })
          );
        }
        Promise.all(disconnectPromises).then( () => {
          done();
        });
      });

      // let the Reporter publish an update to the object
      let msg = MessageFactory.createUpdateMessageRequest(
        address,
        address + "/changes", // to
        "new Value",  // attribute value
        null,
        "changedAttribute" // attribute name
      );

      // send update msg via the Reporters stub
      start = Date.now();
      busReporter.sendStubMsg(msg);
    });
  }

  it('subscribe and publish event with 100 listeners', function(done) {
      testNSubscribers(100, done);
  });

  it('subscribe and publish event with 200 listeners', function(done) {
      testNSubscribers(200, done);
  });
});
