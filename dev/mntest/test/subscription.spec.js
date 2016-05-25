import expect from 'expect.js';
import StubLoader  from './StubLoader.js';
import Bus         from './Bus.js';
import Util        from './Util.js';

let ServiceFramework = require('service-framework');
let MessageFactory = new ServiceFramework.MessageFactory(false,{});

describe('subscription and syncher spec', function() {

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
  let stubSubscriber;
  let busSubscriber;

  it('allocate object address', function(done) {

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


  it('subscribe for object address with body.source', function(done) {
    let msg;

    busSubscriber = new Bus( (m, num) => {
      switch (num) {
        case 1:
          util.expectConnected(m, runtimeStubURLSubscriber);

          // NOTE: there is no support for a SubscribeMessageBody in the MessageFactory --> creating msg manually
          msg = {
            // NOTE: According to the spec, id should be a String, but at least Vertx breaks if it really is --> relaxing test
            id: 2,
            type: "subscribe",
            from: runtimeStubURLSubscriber + "/sm",
            to: msgNodeAddress + "/sm",
            body: {
              subscribe: [address + "/changes", address + "/children/name1"],
              source : runtimeStubURLSubscriber
            }
          };
          busSubscriber.sendStubMsg(msg);
          break;

        case 2:
          // this message is expected to be the subscription response
          expect(m.id).to.eql("2");
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(msgNodeAddress + "/sm");
          expect(m.to).to.eql(runtimeStubURLSubscriber + "/sm");
          expect(m.body.code).to.eql(200);

          done();

        default:
      }
    },
    // enable / disable log of received messages
    false);

    stubSubscriber = stubLoader.activateStub(runtimeStubURLSubscriber, busSubscriber, runtimeURLSubscriber);
    stubSubscriber.connect();
  });

  it('publish and receive update', function(done) {
    let msg;

    busSubscriber.setStubMsgHandler((m, num) => {
      switch (num) {
        case 3:
          // this message is expected to be the incoming update msg
          expect(m.id).to.eql("1");
          expect(m.type.toLowerCase()).to.eql("update");
          expect(m.from).to.eql(address);
          expect(m.to).to.eql(address + "/changes");
          expect(m.body.attribute).to.eql("changedAttribute");
          expect(m.body.value).to.eql("new Value");

          stubReporter.disconnect();
          stubSubscriber.disconnect();
          done();

        default:
      }
    });

    // let the Reporter publish an update to the object
    msg = MessageFactory.createUpdateMessageRequest(
      address,
      address + "/changes", // to
      "new Value",  // attribute value
      null,
      "changedAttribute" // attribute name
    );

    // send update msg via the Reporters stub
    busReporter.sendStubMsg(msg);

  });

});
