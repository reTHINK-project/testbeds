
2.2. IMS (Fraunhofer)

Architecture and main services

![IMS](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/IMS.png)

IMS Core provides session signalling based on SIP and AAA capabilities based on Diameter

IMS control and content Application Servers can be dynamically connected to IMS Core for signalling

Transport is based on RTP

2.2.1 IMS Architecture

The IMS is an Overlay Session/Service Control Architecture on top of the Packet domain based on IP technologies and protocols:
IMS Core
S-CSCF (Serving Call Session Control Function) the IMS anchor point in the home network
I-CSCF (Interrogating Call Session Control Function) provides topology hiding
P-CSCF (Proxy Call Session Control Function) entry point into IMS world
MRF (Media Resource Function) – Media Server hosting special resources
MGCF (Media Gateway Control Function) for interworking with legacy networks
PCC (Policy Charging & Control) for integrated QoS Control and Charging
IMS Application Layer
HSS (Home Subscriber System) for maintaining subscriber and AS profiles
AS (Application Server Function) for specific applications or enabling services
The main new protocols used are (IETF’s) SIP and DIAMETER (but 3GPP MAP and CAP are also important).

![IMS_ARCHIT](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/ims_archit.png)

2.2.1.1 UE
May contain ISIM for authentication
Public and private user id
User Network address
Security algorithms and keys
Contains the IMS client (extended SIP) user agent
May contain additional IMS enabler client software (DMC, XCAP, etc.)
Provides for the media transport RTP, RTCP, and MSRP 
Provides various media codecs (audio, video, etc.)
May support different bearer networks (UMTS, WLAN, WiMAX, etc.)
For GPRS: establishes a GPRS PDP context for 
Signaling (either dedicated or a general one)
Media transport
Correlate between session control and QoS reservation

2.2.1.2 HSS
Maintains subscription information about the users
Contains user profile information indicating
Private and public identities of the user
Authentication information
Which services and medias the user is eligible for using
Filtering criteria for choosing appropriate AS
Acts as Diameter server
Connected through Cx interface to S-CSCF and I-CSCF
Connected also to AS through Sh interface
Assists I-CSCF in choosing the appropriate S-CSCF
Downloads user profile upon registration into S-CSCF and stores actual S-CSCF per user
Can act as a data store for AS and can inform AS about user changes

2.2.1.3 CSCFs
Is a SIP server and talks IMS - SIP
Call set-up/termination and state/event management
Address Analysis, translation, modification if required, address portability, mapping of alias addresses
Interacts with HSS in the home domain to receive profile information for the user
Provides access to application servers through filter mechanisms 
Interacts with MRF in order to support multi-party and other services
The 3 important types of CSCF exist: proxy, interrogating, serving

![ims_cscfs](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/ims_cscfs.png)

2.2.2	Rich Communication Services:  

(Registration, Chat, Presence, Call, Emergency, Location)

2.2.2.1 Registration

![ims_reg](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/ims_reg.png)

2.2.2.2 Audio/Video Call

![ims_call](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/ims_call.png)

*	Required functionalities
	
Bind functionality to component (idm-> HSS); 
IMS World Services to required functionality create table
			
			
			

*	Message Flows (?)
![ims_call_flow](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/ims_call_flow.png)

2.2.2.3 Messaging (Chat)

![ims_chat_flow](https://github.com/reTHINK-project/testbeds/blob/master/docs/D6.2/ims_chat_flow.png)
