# Quick installation guide of the reThink Platform.
For dummies :-)

This page summurizes in an single document the minimum information to install a complete communication platform of the reThink framework.
After doing it you will be able to run a Hello World communication between Alice and Bob.  
Platforms are available in Docker images. The prefered host is an ubuntu 14.04. It is recommended that the containers are deployed behind a reverse proxy to add security features ([nude apache2](https://github.com/reTHINK-project/testbeds/tree/master/docker/apache2-reverse-proxy-baseline) or [Managed OSA](https://github.com/zorglub42/OSA/)) and also https (free trusted certificates can be obtained on [let's encrypt](https://letsencrypt.org/) see [Quick guide](letsencrypt.md)  ) .

## Components to install
To simplify the first installation, we will consider that: Alice and Bob use the same Communication Service Provider, and the same Identity Provider.  
Q: Is this so simple?  
A (marc):  No, the goal here is to teach the reader on how to set-up a working platform.  The most simplest example is sufficient.  It can be the basis for a developer to create a "stand alone environment" in which he can develop additional hyperties.  I would leave it exactly as it is.  I would rather (if we want to) add an additional section after this one entitled "Expanding the Testbed".  In this section, we can then describe what to do to build a multi-operator platform within one testbed or involving several distributed testbeds.

A: Well Not yet but we're working on it.  
<img src="https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/pfTechView.png" width="350">

### Server side components

* Identity provider (optional).

* Communication service provider (CSP). A CSP contains normally 3 building blocks, a Messaging Node, managing signaling part, a registry (called domain registry) and a catalogue. Whether these nodes can be independent or not is not the purpose of this guide. We consider them as a whole for a service provider.

**comment Marc:**  The catalogue will actually consist (at least) of two parts.  The catalogue-brocker and the catalogue-database.  For testing, one might also consider the catalogue-test-client, but the latter one is optional.  From the figure, I guess that each component will likely resemble a docker image.  If this is the intend of the image, I would "blow up" the catalogue box a bit and include within it two sub-boxes, namely the catalogue-brocker and the catalogue-database.

* Web application server: A minimum demo is provided by the CSP, and relies on the 3 previous nodes.

* Global Registry (optional)
* QoS broker and TURN Servers (Optional)
* Discovery Service (FFS)

### Client side components
* The client side components are included in the runtime. This runtime is downloaded in the browser when the user connects to an application based on the runtime server. Thus, nothing has to be manually installed.

##Let's rock
###Identity Provider

ReThink provides two identity providers available: a [Node.js](https://github.com/reTHINK-project/dev-IdPServer) and a [php](https://github.com/reTHINK-project/dev-IdPServer-phpOIDC) one. First one is recommanded (and dockerized).
These two IdPs are providing OIDC (installation guide is provided in README) and we have implemented IdP Proxy as specified in [ietf WebRTC Security draft](https://tools.ietf.org/html/draft-ietf-rtcweb-security-arch-11).  
After installing one of these two IdPs, at least two users, Alice and Bob have to be created in the database.

###Communication Service Provider

As mentionned above, the communication service providers consists in three services.

####Messaging node
This is the first platform to install (core plateform). ReTHINK has provided three implementations: [VertX](https://github.com/reTHINK-project/dev-msg-node-vertx), [Matrix](https://github.com/reTHINK-project/dev-msg-node-matrix) and [NodeJS](https://github.com/reTHINK-project/dev-msg-node-nodejs).  
Only one is necessary to be installed (currently [VertX](https://github.com/reTHINK-project/dev-msg-node-vertx) is prefered).  

####Domain Registry 


####Catalogue


####Configuration and tests of the CSP
Configuration of the Messaging node:  
Domain Registry and Catalogue have to be accessed by the messaging node.  


###Support Services

####Global Registry (Optional)
The [Global Registry](https://github.com/reTHINK-project/dev-registry-global) is an optional module allowing access to the GUID of users in order to find the services where they are registered.
Global Registry is exposing two ports: one for the REST insterface, and one for the P2P connections (this second one should be let to 5002).  
<img src="https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/gregdeployment.png" width="400">

####QoS Broker (Optional)
The Qod broker is usable by the service provider. The plateform and Installation Guide is available here  [Qos](https://github.com/reTHINK-project/dev-qos-support/broker)  
QoS Broker necessitates to be installed with TURN servers and some configuration. To be used, a CSP has to be referenced in the administration interface of the Broker.

####TURN Server (Optional)

###Application Deployment

####Hello World
The Hello World is installed in the repository [dev-hello](https://github.com/reTHINK-project/testbeds/dev-hello)
## Requirements:
The service example is a deployed in a node "live-server" with a lot of dependencies. Then you can connect index.html using one of the two google accounts.  
openidtest10@gmail.com / testOpenID10  
openidtest20@gmail.com / testOpenID20  
To use these accounts for authentication, one has to configure in the Google could platform the callback url of the service deployed (accessible throught Internet). URL must begin with ___msg-node.___  (e.g. msg-node.powercommunication.rethink.orange-labs.fr).   


Installation of __node.js 5.4__ or more is necessary  
Installation of jspm is necessary  

## Installation guide

To avoid a mess on the host, use a docker node container.

```
docker run -d --name service-framework -it node:5.4 `  
apt-get update   
npm install -g jspm   
mkdir /usr/src/app   
cd /usr/src/app   
jspm install service-framework=github:reTHINK-project/dev-service-framework   
cd /usr/src/app/jspm_packages/github/reTHINK-project/dev-service-framework@0.1.2   
npm run init-setup  
npm install   
gulp encode  
```
--> Only one file can be encoded (what is it for?)
If you choose a Protostub configuration you have to provide the msg-node URL.  

```
apt-get install vim    
vi system.config.json  
```
--> Change the messagning node URL (don't put the prefix _msg-node._ )   
```
npm install -g live-server    
npm start &   
```



