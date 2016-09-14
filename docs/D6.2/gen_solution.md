3. General Solution Design

Goal: interoperability

Relating to key IMS and reTHINK functional element equivalents.

Key common services: registration, something else?

Client side – Infrastructure components (rethink/IMS core components) – services

IMS gateway, sip protostub, Idm concept equivalent, dynamic subscriber allocation

Rethink: Identity model: different identities-> Idp proxies (implement the idm protocol); Idp server: exposes API

IMS: S-CSCF authenticates the user via algorithms, identity keys retrieved from IMS

# Registration
SIP protostub: register to IMS. Identity module in Runtime to manage SIP identity.

## Runtime Administrated Identities

IMS without WebRTC, IMS identity, Runtime administration GUI to manage identities (Paulo will check how the admin GUI works); 
* SIP protostub implements Authentication algorithm
* Identity of SIP protostub added to HSS (user, password)

## Token Based 
For IMS infrastructure with support for WebRTC and Token based authentication

Anton: 3GPP: token based approach: protostub uses the token, cookie is sent back, session established at web level; 

[Websocket protostub] -- access token in SIP header --> [Kamaillo WebSocket IMS Gateway + P-CSCF], S-CSCF does not send the Nonce; 

To be designed: how is the Access Token retrieved : provided by the Identity module in the Runtime

## Hybrid Approach

# IMS Service ->reTHINK Service
# reTHINK Service ->IMS Service
