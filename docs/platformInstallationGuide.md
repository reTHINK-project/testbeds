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
** Comment Simon:** I prefer not to blow up this component in the global view, which try to figure each exposed component used by the service itself, but we can add a more detailed image in the catalogue section.

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

####Domain Registry 
Domain registry is installable from [here](https://github.com/reTHINK-project/dev-registry-domain/server). As the Domain Registry is necessary to run the messaging node, it has to be installed first. The default port of the domain registry is 4567.

####Messaging node
This is the first platform to install (core plateform). ReTHINK has provided three implementations: [VertX](https://github.com/reTHINK-project/dev-msg-node-vertx), [Matrix](https://github.com/reTHINK-project/dev-msg-node-matrix) and [NodeJS](https://github.com/reTHINK-project/dev-msg-node-nodejs).  
Only one is necessary to be installed (currently [VertX](https://github.com/reTHINK-project/dev-msg-node-vertx) is prefered).  

####Catalogue
The catalogue is made out of two main components. A broker, that is needed to access the different services, and one or more database. Documentation can be accessed [here](https://github.com/reTHINK-project/dev-catalogue/tree/master/doc).  
__To be able to run an example, the catalogue database must provide:__ <b>  
 * A reThink runtime  
 * One protostub that allow the usage of the installed messaging node  
 * The Hyperty code and datashema that will be used by the example.</b>    
 
####Configuration and tests of the CSP
Configuration of the Messaging node:  
Domain Registry have to be accessed by the messaging node.  
Catalogue is only refered by its URL.


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
The Hello World is published in the repository [dev-hello](https://github.com/reTHINK-project/testbeds/tree/dev/dev-hello), and its installation manual is provided there.

To be able to run the new application, using Google ID or any OIDC serveur, you must register this application as a "client" of the IdP.

Two google accounts are provided for test purpose:
openidtest10@gmail.com / testOpenID10  
openidtest20@gmail.com / testOpenID20  
To use these accounts for authentication, one has to configure in the Google could platform the callback url of the service deployed (accessible throught Internet). URL must begin with ___msg-node.___  (e.g. msg-node.powercommunication.rethink.orange-labs.fr).   





