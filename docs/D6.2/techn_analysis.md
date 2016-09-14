
2. Technology Analysis

2.1	IMS (Fraunhofer)

Architecture and main services

2.1.1	Rich Communication Service: Registration

*	Required functionalities
	
Bind functionality to component (idm-> HSS); 
IMS World Services to required functionality create table
			
			
			

*	Message Flows (?)

2.1.2	reTHINK 
Architecture and main services
2.1.2.1	Rich Communication Service X (Registration, Chat, Presence, Call, Emergency, Location)
2.1.2.1.1	Required functionalities
2.1.2.1.2	Message Flows

2.1.2.2	Scenarios
D1.1 [2] provides a complete collection of service scenarios around the topic “Smart Cities and Smart Enterprises”. The list of scenarios is:
•	Smart Contextual Assistance (ALB-PT)
•	Enterprise Conversational (Apizee)
•	Participate in a Smart City. This scenario comprises a set of subscenarios:
o	My Guest Application (M2M)
o	My City (Quobis: chat)
o	Tourism in a Smart City (TUB?)
o	Neighborhood (Quobis: chat)
How we select the scenarios and services.
The following sections describe the selected scenarios and the functionalities to be implemented.

2.1.3	Technology Comparison (DT)
2.1.3.1	Overall Functional requirements
reTHINK Rich communication services	Scenarios	reTHINK Functional Requirements	IMS Functional Requirements	
Chat	My City, Neighborhood	Message Passing,
Discovery	Message delivery,
Registration information	
Audio, video calls	Smart Contextual Assistance, Enterprise Conversational	Authentication, Authorization, dynamic subscriber provisioning & discovery	Authentication, Authorization,
SIP sessions	
Mutiparty-calls				
Presence	Smart Contextual Assistance			
Emergency services			Authorize calls to well-known numbers/URNs, Location services	
Smart Location			Location services	
2.1.3.2	Functional equivalents
Components responsible for the common functional requirements (Maybe another way of visualizing it); Registration and Call Setup are procedures, AAA is functional requirement…

Functional Requirement (Procedures)	IMS world	reTHINK world	Equivalent relationship	Comments
	Component	Technology	Component	Technology		
Registration						
Call Setup	P-CSCF, I-CSCF, S-CSCF, E-CSCF	SIP	Message Node	Javascript		
Authentication		Diameter				
Authorization		Diameter				
Accounting		Diameter?				
Service Enablement	IFC in S-CSCF	SIP	Hyperties	Javascript		
Location services	Server side: LRF, client side: ?	PDF-LO location objects				

Functional requirements that are not in common: Emergency call recognition, considered for reTHINK follow-up projects.
