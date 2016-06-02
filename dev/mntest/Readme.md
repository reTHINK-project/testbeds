## Message Node tests

This folder structure contains common conformance tests for the Message Nodes according to the [Message Specification](https://github.com/reTHINK-project/dev-service-framework/tree/master/docs/specs/messages) and some performance related tests as proposed in the [Draft of D6.3](https://bscw.rethink-project.eu/bscw/bscw.cgi/d36924/D6.3%20--%20Trials%20Evaluation.docx)

### Quickstart
#### Initial Setup

For the initial setup you  have to clone the testbeds repo to you machine and execute inside the "dev/mntest" folder

```
npm install
```

The project has a dependency to the service-framework, because it uses the MessageFactory wherever possible.

Of course the machine that runs the tests must have access to the individual Messaging Nodes. In order to gain comparable results it is stronly advised to have them running on the same local machine that executes the tests.

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

The only added attribute is the "domain", which MUST be present. It is used in the testcases to create several urls for the from- and to- fields of the messages.

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

#### Performance tests

### Test results

#### MatrixMN

#### VertxMN

#### NodejsMN
