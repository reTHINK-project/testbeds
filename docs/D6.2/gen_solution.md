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

IMS identity, Runtime administration GUI to manage identities (Paulo will check how the admin GUI works); 

[ IdM ] - authenticate -> [ SIP Protostub ]

[ IdM ] <- returns IMS URL login - [ SIP Protostub ]

[ IdM ] - opens -> [ IMS URL login ]

[ SIP Protostub ] < - login transaction via IdM -> [IMS login  ]

[ IdM ] <- returns token if successful - [ SIP Protostub ]

[ IMS Call Hyperty ] - send msg > [ bus ] - authorise -> [ policy engine ] - getIdToken -> [ IdM  ] 

[ policy engine ] - authorised (msg with token) > [ bus ] - message sent with token -> [ SIP Protostub ] -  send SIP Message with token - > [IMS GW] - validate token [ IMS Token validator ] 



## Token Based (Quobis)
Anton: 3GPP: token based approach: protostub uses the token, cookie is sent back, session established at web level; 

[Websocket protostub] -- access token in SIP header --> [Kamaillo WebSocket IMS Gateway + P-CSCF], S-CSCF does not send the Nonce; 

To be designed: how is the Access Token retrieved : provided by the Identity module in the Runtime

Registration: 
Token, 
http://www.etsi.org/deliver/etsi_ts/124300_124399/124371/13.04.00_60/ts_124371v130400p.pdf

page 33

### Functional Components

WIC = WebRTC IMS Client
IMS UE with native WebRTC client or WebRTC enabled browser
WWSF = WebRTC Web Server Function
HTTP server for WebRTC IMS Client code
eP-CSCF = P-CSCF enhanced for WebRTC 
SIPoverWebSocket/XMPP/REST/JSON-RPC enabled P-CSCF
IMS-ALF = IMS Access GateWay enhanced for WebRTC
IMS Media interop node supporting SRTP/DTLS
WAF = WebRTC Authorisation Function
provides authentication tokens to WWSDF


![eIMS](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/eIMS.png)

# IMS Service ->reTHINK Service
# reTHINK Service ->IMS Service
