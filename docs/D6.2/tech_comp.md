2.3	Technology Comparison -DT-

2.3.1	Overall Functional requirements

SD: are not the functional requirements independent from the technology? There should be just one column of functional requirements, which are mapped to functional equivalents then in the next step.

Rich communication services | Scenarios | Functional Requirements
----------------------------|-----------|---------------------------------|-----------------------------
Chat|- My City<br>- Neighborhood<br>- Smart Contextual Assistance<br>- Enterprise Conversational	|- Message passing/delivery<br>- Registration information<br>- discovery<br>- session Management
Audio, video calls |-	Smart Contextual Assistance<br>- Enterprise Conversational |- Authentication<br>- Authorization<br>- dynamic subscriber provisioning & discovery<br>- session Management
Mutiparty-calls	| |
Presence |- Smart Contextual Assistance<br>- Enterprise Conversational	|- presence of users must be available on request<br>- publish/subscribe pattern (optional)
Emergency services | | -	Authorize calls to well-known numbers/URNs<br>- Location services
Smart Location	| My City |	- Location capabilities

2.3.2	Functional equivalents

Components responsible for the common functional requirements (Maybe another way of visualizing it); Registration and Call Setup are procedures, AAA is functional requirement…

Functional Requirement (Procedures) |	IMS Component (Technology) | reTHINK Component (Technology) |	Equivalent relationship |	Comments
------------------------------------|------------------------------|--------------------------------|-----------------------|-----------
Message passing/delivery   |	P-CSCF, I-CSCF, S-CSCF, E-CSCF	(SIP) |	- Message Node	(Javascript)<br>- P2P Stub | ??? |
Discovery   |	- DHCP/DNS discovery of P-CSCF<br>- ... |	- Global Registry<br>- Domain registries | |
Session Management   |	- S-CSCF |	- Runtime<br>- Message Node| |
Authentication |	- HSS (Diameter)	|	- IDP | |
Authorization	|	Diameter			|	- Policy-engine |	|
Location capabilities  |	Server side: LRF, client side: ? (PDF-LO location objects in SIP body) | - Location Hyperties (per user) |				|
Presence  |	IMS Presence | - Global Registry / Domain Registry | 						
Accounting	|	Diameter?			|	|	|
Call Setup   |	P-CSCF, I-CSCF, S-CSCF, E-CSCF	(SIP) |	Message Node	(Javascript) | |
Service Enablement |	IFC in S-CSCF	(SIP)|	Hyperties	(Javascript) ||

Functional requirements that are not in common: Emergency call recognition, considered for reTHINK follow-up projects.

### Backup:

Rich communication services | Scenarios | reTHINK Functional Requirements | IMS Functional Requirements
----------------------------|-----------|---------------------------------|-----------------------------
Chat|	My City, Neighborhood	| Message Passing, Discovery|	Message delivery, Registration information
Audio, video calls |	Smart Contextual Assistance, Enterprise Conversational | Authentication, Authorization, dynamic subscriber provisioning & discovery | Authentication, Authorization, SIP sessions
Mutiparty-calls	| |
Presence | Smart Contextual Assistance	| |
Emergency services | | |	Authorize calls to well-known numbers/URNs, Location services
Smart Location	| |	|	Location services

2.3.2	Functional equivalents

Components responsible for the common functional requirements (Maybe another way of visualizing it); Registration and Call Setup are procedures, AAA is functional requirement…

Functional Requirement (Procedures) |	IMS Component (Technology) | reTHINK Component (Technology) |	Equivalent relationship |	Comments
------------------------------------|------------------------------|--------------------------------|-----------------------|-----------
Registration | 						
Call Setup   |	P-CSCF, I-CSCF, S-CSCF, E-CSCF	(SIP) |	Message Node	(Javascript) | |
Authentication |	Diameter			|	| |
Authorization	|	Diameter			|	|	|
Accounting	|	Diameter?			|	|	|
Service Enablement |	IFC in S-CSCF	(SIP)|	Hyperties	(Javascript) ||
Location services  |	Server side: LRF, client side: ? (PDF-LO location objects in SIP body) | |				|

Functional requirements that are not in common: Emergency call recognition, considered for reTHINK follow-up projects.
