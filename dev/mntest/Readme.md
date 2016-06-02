## Message Node tests

This folder structure contains common conformance tests for the Message Nodes according to the [Message Specification](https://github.com/reTHINK-project/dev-service-framework/tree/master/docs/specs/messages) and some performance related tests as proposed in the [Draft of D6.3](https://bscw.rethink-project.eu/bscw/bscw.cgi/d36924/D6.3%20--%20Trials%20Evaluation.docx)

### Quickstart
#### Initial Setup

For the initial setup you  have to clone the testbeds repo to you machine and execute inside the "dev/mntest" folder

```
npm install
```

The project has a dependency to the service-framework, because it uses the MessageFactory wherever possible.

Of course the machine that runs the tests must have access to the individual Messaging Nodes. In order to gain comparable results it is stronly advised to have them running on the same local machine that executes the tests. The registry related testcases also require the availability of a running instance of the domain-registry, which is accessible by each MN.

Instructions for the installation, configuration and operation of the message nodes can be found on the corresponding github repos.

#### Configure Stubs

The "src/stub" folder contains the latest version of the Stub-sources for each of the currently available message nodes.
For each stub there is a corresponding config file:

```
matrix.conf.js
vertx.conf.js
nodejs.conf.js
```
This file is used to configure the stub with the information it needs. This configuration holds the same data as the "configuration" section in the ProtoStub.json file of the local catalogue.
The only added attribute is the "domain", which is mandatory and MUST be present. It is used in the testcases to create several urls for the from- and to- fields of the messages.

#### Execute tests for an individual Message Node

After the configuration of the stubs and the execution of the Message nodes the tests can be started via special gulp-tasks:

To test the MatrixMN run:

```
gulp testmatrix
```

To test the VertxMN run:

```
gulp testvertx
```

To test the NodejsMN run:

```
gulp testnodejs
```

Each task starts the Karma tests with an individual configuration file named "matrix.karma.js", "vertx.karma.js" and "nodejs.karma.js".

### Test descriptions

#### Conformance tests

##### connect.spec.js

The purpose of this test is to ensure that the Stub exposes the "status" events as specified in [deploy-protostub.md](https://github.com/reTHINK-project/dev-service-framework/blob/master/docs/specs/dynamic-view/basics/deploy-protostub.md)

It instantiats a stub and performs a connection and then a disconnection of the stub to the corresponding MN.

```
Specification issue:

The factual implementation in the Vertx stub introduced "connected" and "disconnected" events instead of the "LIVE" event as specified. This implementation has been taken over by the other stubs and is now de-facto standard.
```

##### hyperty-allocation.spec.js

The purpose of this test is to ensure the Conformance of the MN operations with the Specification at [address-allocation-messages.md](https://github.com/reTHINK-project/dev-service-framework/blob/master/docs/specs/messages/address-allocation-messages.md)

It checks the allocation and de-allocation of hyperty addresses by the MNs.
It includes following sub-tests:

- allocation of a single address
- check that a potentially given "scheme" is ignored for hyperty address allocations
- de-allocation of a single address
- allocation of an address block
- de-allocation of an address block
- allocation of an address block with an allocationKey
- de-allocation of an address block with an allocationKey

```
MessageFactory issue:

The MessageFactory does not support the "body.scheme" attribute. Therefore some allocation messages are created manually.
```

##### object-allocation.spec.js

The purpose of this test is to ensure the Conformance of the MN operations with the Specification at [address-allocation-messages.md](https://github.com/reTHINK-project/dev-service-framework/blob/master/docs/specs/messages/address-allocation-messages.md)

It checks the allocation and de-allocation of object addresses by the MNs.
It includes following sub-tests:

- allocation of a single address incl. check that a given "scheme" is used for the object address allocations
- de-allocation of a single address
- allocation of an address block
- de-allocation of an address block
- allocation of an address block with an allocationKey
- de-allocation of an address block with an allocationKey

```
MessageFactory issue:

The MessageFactory does not support the "body.scheme" attribute. Therefore some allocation messages are created manually.
```


#### Performance tests

### Test results

#### MatrixMN

#### VertxMN

#### NodejsMN
