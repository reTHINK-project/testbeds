
2. Technology Analysis

2.1	[IMS](ims.md) -Fraunhofer-

2.2	[reTHINK](rethink.md) -Apizee?-

2.3	[Technology Comparison](tech_comp.md) -DT-

2.3.1	Overall Functional requirements
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
