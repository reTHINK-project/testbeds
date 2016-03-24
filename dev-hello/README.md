# Hello World simple Demo
This example is a standalone application that aims to illustrate the basics of Hyperty concept and th way it works.


## Prerequisite
This application is based on the Hello World hyperty, that have to be already deployed in a catalogue. For example if your service provider is rethink.com following files have to be accessible:  
https://catalogue.rethink.com/.well-known/runtime/defaultRuntime (to upload the runtime in the browser)  
https://catalogue.rethink.com/.well-known/protocolstub/MsgNodeProtoStub (to be able to access the messaging node)   

https://catalogue.rethink.com/.well-known/hyperty/HelloWorld  
https://catalogue.rethink.com/.well-known/dataschema/HelloWorldDataSchema  
for the Hyperties.   

For the Web application HelloWorld you just need a web server (no node server or transpiler needed).  

This example is written in ECMA5 and does not need any transformation to run on a browser.

## Functions
This Example will show you:  
 * How to load a runtime (proviously deployed on a catalogue server)  
 * How to load an hyperty (Authentication mandatory)  
 * How to contact another Hyperty to send HelloWorld Service.   
  
Files included:
index.html :main page  
helloWorldHypertyClient.js : javascript that manage the Hyperties in the application
system.config.json : configuration file that has to be modified to make the service run. It includes the domain name of the catalogue and the application.
