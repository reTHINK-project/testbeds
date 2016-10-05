2.2	reTHINK (Apizee?)

2.2.1 Architecture overview

reTHINK is a framework that provides solutions to manage real time communication  (human to human and machine to machine). The framework integrate and react to contextual information in a secured way while respecting privacy. 
To achieve this, the reTHINK framework solution involves the creation of dynamic web-based service named ‘hyperties’, which remain active for the duration of the particular service logic that has instigated their creation. The reTHINK architecture is built around these Hyperlinked Entities (hyperties). The solution also leverages the protocol-on-the-fly (ProtoFly) concept to avoid creating or modifying standard network protocols, but moving instead towards an API based flat service architecture. 

The reTHINK project envisages a global network of interconnected hyperties that are executed in web runtime environment on endpoints or edge-network servers. Such a global network could be seen as the well-known hyperlink concept of the Web extended to programmable links. Hyperties communicate with each other by exchanging messages in peer-to-peer (P2P) mode, and they manage, for example, the payload as WebRTC P2P media and data streams. Protocols and governance functionalities are abstracted by the web runtime procedures, using web services and local APIs.
![RETHINK](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/rethink_architecture.png)

2.2.2 Functional Architecture
The functional architecture describes the functions and services that the reTHINK project addresses. The functional descriptions of the architecture components are given in the figure below. These functions reside not only at the CSP platform, but also across the user devices, where software is downloaded and executed locally, thus enabling a peer-to-peer implementation of session control, but also providing CSP services. Software modules which are dynamically downloaded to the endpoint devices are ‘hyperties. 

![RETHINK_FUNCTIONAL](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/rethink_functional.png)

2.2.2.1 Messaging Services
Messaging Services provide real time message oriented communication functionalities used by user services to communicate (Message Routing). They provide different communication patterns including publish/scommunicationbscribe communication. 

Message Routing, including pub/sub Subscriptions, are subject to Access Control in co-operation with authentication and authorisation provided by Identity Management functionalities.
Session Management functionalities are used to control messaging connections to service provider back-end services including allocation of messaging addresses to user services in cooperation with authentication and authorisation provided by Identity Management functionalities. For example, when user turns-on the device and connects to its domain, providing credentials as required by Identity Management functionalities.
Initial establishment of stream communication between User Services (e.g. Audio and Video media streams) is achieved via the Communication Setup functionality.
Messaging Services are User Service type agnostic playing a key role in reTHINK architecture, by providing functionalities to support Hyperty instances communication.
Usage examples:
•	to support signalling messages exchange between peers to set-up and control H2H media communication;
•	to support the exchange of messages between context providers and context consumers (e.g. to handle presence status management or for IoT applications). 

2.2.2.2 Identity Management
The Identity Management service verifies the Identity of an End-User, provides End-user authentication, authorisation and access to End-User profile information. Users may utilise an independent identity provider and provide their security tokens to the CSP, but the CSP has to verify the user further, to ensure that if, and at what level, service delivery is authorized. This process may involve the interaction between the CSP and the ASP.
User Id can be determined by different kind of identifiers: email, webID, OpenID, URL, mobile phone number or any other global identifier, and may have more than one authentication factor. CSP’s identity management may provide means of relating various identifiers and devices to a single user account.

2.2.2.3 Catalogue
Catalogue is the functional element that lists the services available for service domain (namely a service provider). It provides access to Services assets including service descriptions, software services, policy, documentation, and other assets or artefacts that are essential to the operation of the service.
The catalogue is a service provider's list of available services (which generates runtime hyperty instances), that are available to any application with valid permissions to use it. It is the place where you describe available hyperties, independently of where they will run. The catalogue items include information like type, description, input/output data formats, code and interfaces. 
Each Service Provider can broadcast its hosted services to the community of developers and existing application providers, in order to invite them to subscribe to its hosted services. This entails viewing of the catalogue of services and their capabilities, as well as exposed SDK (Service Development Kit).

2.2.2.4 Registry
The Registry is a specific component of the reTHINK architecture, dedicated to hyperties. The hyperty Registry provides functionality of a directory service to find users’ addresses and availability. The Register logs currently active hyperty instances when they are launched and are indexed by a pointer (e.g. a URL). Information provided for each registered instance by the hyperty Registry comprises current network location, type of hyperty (communication, identity…), description, start time etc. A list of registered hyperty instances for a specific user can be retrieved through a lookup function. Since the Registry records actively running hyperties, it provides information about a user’s presence and availability for incoming calls and services. 
When users (or services) initiate hyperty instances to be launched, the hyperty information is ‘published’ in the hyperty Registry, and these records are maintained to keep the Registry up to date. For this purpose, the hyperty Registry provides an interface for registration and deregistration of hyperty instances, as well as for keeping the published information up to date.

2.2.2.5	Discovery 
In the reTHINK architecture, user discovery is the service used to find destination users, on whichever device they are currently logged on, in order to launch a connectivity request towards them.
The reachability of users hinges on associating hyperty instances with users. Users requesting connectivity establish the CSP domain for the target destination via a search of IdPs, who may need to establish first which IdP has the destination’s address. 
The proposed process involves the instigating software sending an enquiry towards the domain hosting the destination user, according to the URL. On receiving the enquiry, the destination CSP performs a looks up procedure on its Registry of active hyperties, and responds with the hyperty’s address, if found there. If not found, the user is unavailable.
The CSP registry is, in fact, a location manager for ‘live’ user hyperties. Such always-on registries can form a mesh of servers that may (with appropriate security measures) allow inter-registry search. This mechanism is essentially the same as above, but with a direct approach, basing the procedure on a search engine of distributed dynamic data, similar to ‘Dynamic DNS’.



2.2.3	Rich Communication Service X (Registration, Chat, Presence, Call, Emergency, Location)

The reTHINK architectural functions are based on a series of such hyperties that are generated by the service provider, and are downloaded to the users’ endpoints, so that communication traffic is only required for initiating the sessions. The hyperty modules represent a set of services that are stored in a Catalogue. The instantiated versions of these hyperties are registered in a Registry, which represents authenticated users who are available for in-coming connectivity service. Therefore, the Registry serves as a location manager and is used for user discovery. 

Hyperties cooperate each other with a Resource Oriented Messaging model implemented by a simple Messaging Framework. The Hyperty Messaging Framework, supports different messaging patterns including publish/subscribe and request/response messaging patterns. The higher level Reporter - Observer communication pattern works on top of these basic messaging patterns
The Message delivery is based on a simple message Router functionality that performs a lookup for listeners registered to receive the Message (the "Message.to" Header field is the only information looked up for). The Message is posted to all found listeners, which can be other Routers or end-points (Hyperties). Thus, the Hyperty Messaging Framework is comprised by a network of Routers where each Router only knows adjacent registered Routers or end-points.


The Messaging Framework works at three layers:
At the Runtime Sandbox level where Hyperties are executing, message delivery is provided by the MiniBUS component.
At the Runtime level where Sandboxes are hosted (e.g. in a Browser or in a NodeJS instance), message delivery is provided by the Message BUS component, which is an extension of the MiniBUS.
![MSG_ROUTING](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/message_routing.png)

At Domain Level, message delivery is provided by the Message Node functionality by using the Protofly mechanism, i.e. communication between Message BUS and Message Nodes and among Message Nodes are protocol agnostic. This also means that the Message Node can be provided by any Messaging solution as soon as there is a Protostub available. Currently, a Vertx Message Node, a Matrix Message Node and a NodeJS Message Node are provided.

Hyperties cooperate each other through a Data Synchronisation model called Reporter - Observer. 
Hyperty Reporter - Observer communication pattern is using a P2P Synchronisation solution for JSON Data Objects, here called Hyperty Data Object or Sync Data Object. To avoid concurrency inconsistencies among peers, only one peer has granted writing permissions in the Hyperty Data Object - the Reporter hyperty - and all the other Hyperty instances only have permissions to read the Hyperty Data Object - the Observer hyperty.
Through very simple APIs, Hyperties can create Synchronized Data Object or subscribe to them.
The follwowing chapter shows how services are implemented using such data objects.

2.2.3.1 Chat hyperty
Chat data Object, Chat Hyperty send and receive message

2.2.3.2 Audio/Video Call
Hyperty connection

2.2.3.3 Location
Hyperty Location


2.2.4	Scenarios

[AV]: What should we provide for the scenarios?

D1.1 [2] provides a complete collection of service scenarios around the topic “Smart Cities and Smart Enterprises”. The list of scenarios is:
*	Smart Contextual Assistance (ALB-PT)
*	Enterprise Conversational (Apizee)
*	Participate in a Smart City. This scenario comprises a set of subscenarios:
*	My Guest Application (M2M)
*	My City (Quobis: chat)
*	Tourism in a Smart City (TUB?)
*	Neighborhood (Quobis: chat)
How we select the scenarios and services.
The following sections describe the selected scenarios and the functionalities to be implemented.
