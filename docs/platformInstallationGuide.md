# Quick installation guide of the reThink Platform.
For dummies :-)

This page is dedicated to summurize in an single and simple document the necessary information to install a complete communication platform of the reThink framework with all the developped platform that can acheive one and only one goal: setup a trusted communication between Alice and Bob.

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

