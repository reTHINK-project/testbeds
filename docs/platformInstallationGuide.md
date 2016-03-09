# Quick installation guide of the reThink Platform.
For dummies :-)

This page is dedicated to summurize in an single and simple document the necessary information to install a complete communication platform of the reThink framework with all the developped platform that can acheive one and only one goal: setup a trusted communication between Alice and Bob.  
Platforms provided are focused on the functional part. It is recommended that the platforms are deployed behind a reverse proxy to add security features and also https (free full trusted certificates can be obtained on [let's encrypt](https://letsencrypt.org/)) site.

## Components to install
To simplify the first installation, we will consider that: Alice and Bob use the same Communication Service Provider, and the same Identity Provider.

### Server side components
#### Minimum set of platforms
* Identity provider.
* Communication service provider (CSP). A CSP contains normally 3 building blocks, a Messaging Node, managing signaling part, a registry (called domain registry) and a catalogue. Whether these nodes can be independent or not is not the purpose of this guide. We consider them as a whole for a service provider.
* Web application server: A minimum demo is provided by the CSP, and relies on the 3 previous nodes.

#### Support services
* Global Registry
* QoS broker and TURN Servers (FFS)
* Discovery Service (FFS)

### Client side components
* The client side components are included in the runtime. This runtime is downloaded in the browser when the user connects to an application based on the runtime server. Thus, nothing has to be manually installed.

Q: Is this so simple?  
A: Well Not yet but we're working on it.  
<img src="https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/pfTechView.png" width="400">

###Identity Provider

ReThink provides two identity providers available here https://github.com/reTHINK-project/dev-IdPServer and https://github.com/reTHINK-project/dev-IdPServer-phpOIDC .
These two IdPs are providing OIDC (installation guide is provided in README) and we have implemented IdP Proxy as specified in https://tools.ietf.org/html/draft-ietf-rtcweb-security-arch-11 . After installing one of these two IdPs, at least two users, Alice and Bob have to be created in the database.

###Communication Service Provider

As mentionned above, the communication service providers consists in three services.

####Messaging node
This is the first platform to install (core plateform). ReTHINK has provided three implementations: [VertX](https://github.com/reTHINK-project/dev-msg-node-vertx), [Matrix](https://github.com/reTHINK-project/dev-msg-node-matrix) and [NodeJS](https://github.com/reTHINK-project/dev-msg-node-nodejs).  

####Domain Registry 

####Catalogue

###Support Services

####Global Registry

###Application Deployment

####Hello World


