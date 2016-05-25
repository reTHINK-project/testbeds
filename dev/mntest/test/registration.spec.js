import expect from 'expect.js';
import StubLoader  from './StubLoader.js';
import Bus         from './Bus.js';
import Util        from './Util.js';

let ServiceFramework = require('service-framework');
let MessageFactory = new ServiceFramework.MessageFactory(false,{});

describe('hyperty registration spec', function() {

  let stubLoader = new StubLoader();
  let stubConfig = stubLoader.config;
  let util = new Util();

  let runtimeURL     = "runtime://" + stubConfig.domain + "/1";
  let runtimeStubURL = 'hyperty-runtime://' + stubConfig.domain + '/protostub/1';
  let msgNodeAddress = "domain://msg-node." + stubConfig.domain + "/hyperty-address-allocation";
  let mnRegistryAddress = "domain://registry." + stubConfig.domain;
  let hypertyURL     = "hyperty://" + stubConfig.domain + "/hyperty-instance-id";
  let address;
  let userId = 'user://google.com/openIdTest10';
  let hypertyDescriptorURL = 'http://' + stubConfig.domain + '/RegistrationTestHyperty';

  it('register hyperty address', function(done) {
    let stub;
    let msg;

    let bus = new Bus( (m, num) => {
      switch (num) {
        case 1:
          util.expectConnected(m, runtimeStubURL);

          // allocate addresses without an allocationKey
          msg = MessageFactory.createCreateMessageRequest(
            runtimeStubURL + "/registry/allocation", // from
            msgNodeAddress, // to
            { // body.value
              number: 1
            },
            "policyURL" // policy
          );
          bus.sendStubMsg(msg);
          break;

        case 2:
          // this message is expected to be the allocation response
          expect(m.id).to.eql(msg.id);
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(msgNodeAddress);
          expect(m.to).to.eql(runtimeStubURL + "/registry/allocation");
          expect(m.body.code).to.eql(200);
          expect(m.body.value.allocated.length).to.be(1);
          address = m.body.value.allocated[0];

          msg = MessageFactory.createCreateMessageRequest(
            runtimeStubURL + "/registry", // from runtime, not hyperty
            mnRegistryAddress, // to
            {
              user: userId,
              hypertyDescriptorURL: hypertyDescriptorURL,
              hypertyURL: address
            }, // body.value
            "policyURL" // policyURL
          );
          bus.sendStubMsg(msg);
          break;

        case 3:
          // this message is expected to be the registration response
          expect(m.id).to.eql(msg.id);
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(mnRegistryAddress);
          expect(m.to).to.eql(runtimeStubURL + "/registry");
          expect(m.body.code).to.eql(200);

          stub.disconnect();
          done();
          break;

        default:
      }
    },
    // enable / disable log of received messages
    false);

    stub = stubLoader.activateStub(runtimeStubURL, bus, runtimeURL);
    stub.connect();
  });

  it('read hyperty address by user', function(done) {
    let stub;
    let msg;

    let bus = new Bus( (m, num) => {
      switch (num) {
        case 1:
          util.expectConnected(m, runtimeStubURL);

          msg = MessageFactory.createReadMessageRequest(
            hypertyURL, // from runtime, not hyperty
            mnRegistryAddress, // to
            userId, // body.resource
            "attribute" // attribute
          );
          // hack to potentially avoid the ConcurrentModification Exceptions in the domain registry
          // setTimeout( () => {
            bus.sendStubMsg(msg);
          // }, 500 );
          break;

        case 2:
          // this message is expected to be the registration response
          expect(m.id).to.eql(msg.id);
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(mnRegistryAddress);
          expect(m.to).to.eql(hypertyURL);
          expect(m.body.code).to.eql(200);
          expect(m.body.value[address]).not.to.be.null;

          stub.disconnect();
          done();
          break;

        default:
      }
    },
    // enable / disable log of received messages
    false);

    stub = stubLoader.activateStub(runtimeStubURL, bus, runtimeURL);
    stub.connect();
  });


  it('keep registration alive', function(done) {
    let stub;
    let msg;

    console.log("The \"keep-alive\" test WILL FAIL!, because the Spec. differs from what the RegistryConnector implements.")
    let bus = new Bus( (m, num) => {
      switch (num) {
        case 1:
          util.expectConnected(m, runtimeStubURL);

          msg = MessageFactory.createUpdateMessageRequest(
            hypertyURL, // from runtime, not hyperty
            mnRegistryAddress, // to
            "dummy value to make the MessageFactory happy", // value
            hypertyURL, // body.resource
            "attribute" // attribute
          );
          bus.sendStubMsg(msg);
          break;

        case 2:
          // this message is expected to be the registration response
          expect(m.id).to.eql(msg.id);
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(mnRegistryAddress);
          expect(m.to).to.eql(hypertyURL);
          expect(m.body.code).to.eql(200);

          stub.disconnect();
          done();
          break;

        default:
      }
    },
    // enable / disable log of received messages
    false);

    stub = stubLoader.activateStub(runtimeStubURL, bus, runtimeURL);
    stub.connect();
  });

  it('read hyperty address by user and type', function(done) {
    let stub;
    let msg;

    console.log("The \"read-hyperty-by-user-and-type\" test WILL FAIL!, because the Spec. differs from what the RegistryConnector implements.")
    let bus = new Bus( (m, num) => {
      switch (num) {
        case 1:
          util.expectConnected(m, runtimeStubURL);

          msg = {
            // NOTE: MessageFactory does not support body.critera field --> creating message manually
            // NOTE: According to the spec, id should be a String, but at least Vertx breaks if it really is --> relaxing test
            id: 1,
            type: "read",
            from: hypertyURL,
            to: mnRegistryAddress,
            body: {
              resource : userId,
              criteria : {
                "descriptor.hypertyType" : "NO-IDEA-ABOUT-THE-TYPE"
              }
            }
          };

          bus.sendStubMsg(msg);
          break;

        case 2:
          // this message is expected to be the registration response
          expect(m.id).to.eql(msg.id);
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(mnRegistryAddress);
          expect(m.to).to.eql(hypertyURL);
          expect(m.body.code).to.eql(200);
          expect(m.body.value).not.to.be.null;

          stub.disconnect();
          done();
          break;

        default:
      }
    },
    // enable / disable log of received messages
    false);

    stub = stubLoader.activateStub(runtimeStubURL, bus, runtimeURL);
    stub.connect();
  });


  it('read hyperty address by user and object scheme', function(done) {
    let stub;
    let msg;

    console.log("The \"read-hyperty-by-user-and-object-scheme\" test WILL FAIL!, because the Spec. differs from what the RegistryConnector implements.")
    let bus = new Bus( (m, num) => {
      switch (num) {
        case 1:
          util.expectConnected(m, runtimeStubURL);

          msg = {
            // NOTE: MessageFactory does not support body.critera field --> creating message manually
            // NOTE: According to the spec, id should be a String, but at least Vertx breaks if it really is --> relaxing test
            id: 1,
            type: "read",
            from: hypertyURL,
            to: mnRegistryAddress,
            body: {
              resource : userId,
              criteria : {
                objects : ["object-url-scheme-1", "object-url-scheme-2"]
              }
            }
          };

          bus.sendStubMsg(msg);
          break;

        case 2:
          // this message is expected to be the registration response
          expect(m.id).to.eql(msg.id);
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(mnRegistryAddress);
          expect(m.to).to.eql(hypertyURL);
          expect(m.body.code).to.eql(200);
          expect(m.body.value).not.to.be.null;

          stub.disconnect();
          done();
          break;

        default:
      }
    },
    // enable / disable log of received messages
    false);

    stub = stubLoader.activateStub(runtimeStubURL, bus, runtimeURL);
    stub.connect();
  });

  it('unregister hyperty address', function(done) {
    let stub;
    let msg;

    let bus = new Bus( (m, num) => {
      switch (num) {
        case 1:
          util.expectConnected(m, runtimeStubURL);

          msg = MessageFactory.createDeleteMessageRequest(
            runtimeStubURL + "/registry", // from runtime, not hyperty
            mnRegistryAddress, // to
            {
              user: userId,
              hypertyDescriptorURL: hypertyDescriptorURL,
              hypertyURL: address
            }, // resource
            "attribute" // attribute
          );
          bus.sendStubMsg(msg);
          break;

        case 2:
          // this message is expected to be the registration response
          expect(m.id).to.eql(msg.id);
          expect(m.type.toLowerCase()).to.eql("response");
          expect(m.from).to.eql(mnRegistryAddress);
          expect(m.to).to.eql(runtimeStubURL + "/registry");
          expect(m.body.code).to.eql(200);

          stub.disconnect();
          done();
          break;

        default:
      }
    },
    // enable / disable log of received messages
    false);

    stub = stubLoader.activateStub(runtimeStubURL, bus, runtimeURL);
    stub.connect();
  });


});
