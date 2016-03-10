# Quick installation guide of the reThink Platform.
For dummies :-)

This page summurizes in an single document the minimum information to install a complete communication platform of the reThink framework.
After doing it you will be able to run a Hello World communication between Alice and Bob.  
Platforms are available in Docker images. The prefered host is an ubuntu 14.04. It is recommended that the containers are deployed behind a reverse proxy to add security features ([nude apache2](https://github.com/reTHINK-project/testbeds/tree/master/docker/apache2-reverse-proxy-baseline) or [Managed OSA](https://github.com/zorglub42/OSA/)) and also https (free trusted certificates can be obtained on [let's encrypt](https://letsencrypt.org/) see [Quick guide](letsencrypt.md)  ) .

## Components to install
To simplify the first installation, we will consider that: Alice and Bob use the same Communication Service Provider, and the same Identity Provider.  
Q: Is this so simple?  
A: Well Not yet but we're working on it.  
<img src="https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/pfTechView.png" width="400">

### Server side components

* Identity provider (optional).

* Communication service provider (CSP). A CSP contains normally 3 building blocks, a Messaging Node, managing signaling part, a registry (called domain registry) and a catalogue. Whether these nodes can be independent or not is not the purpose of this guide. We consider them as a whole for a service provider.
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

####QoS Broker (Optional)
The Qod broker is usable by the service provider. The plateform and Installation Guide is available here  [Qos](https://github.com/reTHINK-project/dev-qos-support/broker)  
QoS Broker necessitates to be installed with TURN servers and some configuration. To be used, a CSP has to be referenced in the administration interface of the Broker.

####TURN Server (Optional)

###Application Deployment

####Hello World


