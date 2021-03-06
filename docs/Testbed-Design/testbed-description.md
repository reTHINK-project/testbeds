
##Testbed requirements
### Requirements from D5.1
Requirements have been gathered from scenarios point of view. We first list the applications that will finally be available.

#### List of applications
 * Smart Contextual Assistance
  * Responsible: PT 
 * Hotel Guest
  * Responsible: Quobis 
 * Hotel Administrator
  * Responsible: Quobis 
 * Mycity
  * Responsible: DT 
 * Mycity (Manager?)
  * Responsible: DT 
 * Tourism
  * Responsible: DT 
 * Participate
  * Responsible: DT 
 * SmartBusinessApp
  * Responsible: APIZee 
 * SmartBusinessApp Customer
  * Responsible: APIZee 
 * AddressBook
  * Responsible: TUB? 
 * Voice Call
  * Responsible: PT

#### List of scenarios
##### Smart Contextual assistance:
The following domains should be provided:
 * hybroker.rethink.ptinovacao.pt
HyBroker should provide the following servers (and associated sub-domains):  
  * Vertx messaging node (node.broker.rethink.ptinovacao.pt)
  * Domain registry (registry.broker.rethink.ptinovacao.pt)
  * Catalogue server (catalogue.broker.rethink.ptinovacao.pt)
  * IdM server (idm.broker.rethink.ptinovacao.pt)
 * hysmart.rethink.ptinovacao.pt
 * iHacker.rethink.ptinovacao.pt  
 * Global registry
 * TURN/STUN server

##### Hotel Guest
_The testbed should have at least 3 virtual machines available for the Catalogue, the LWM2M Message Node and the Identity Manager Server/Identity Management Subsystem._  
Implementation is to be determined (wheater it is deployed on 3 VMs or in 3 docker images in a VM with reverse proxyfication

##### My City
A <My City domain> is required for My City implementation.  
DT lab should provide the following servers (and associated sub-domains):  
 * Node.js Messaging Node (node.< My City domain >)
 * Domain Registry (registry.< My City domain >)
 * Catalogue server (catalogue.< My City domain >)
 * IdM Server (idm.< My City domain >)
 * Web server (web.< My City domain >)
 * Global Registry

##### Tourism in a smartcity
  * At least one messaging node 
  * At least one Domain Registry
  * At least one node of the Global Registry
  * At least one Catalog
  
##### Neigbourhood
Phase 1  
The following domains/network should be provided:  
* rethink.xxx.de (as global domain) for global registry, TURN server, …
* talknow.rethink.xxx.de
* participate.rethink.xxx.de  
Participate should provide the following servers (and associated sub-domains):  
 * Participate Webserver hosting the Participate App (participate.rethink.xxx.de)
 * Matrix Messaging Node (msg-node.participate.rethink.xxx.de)
 * Domain Registry (dreg.participate.rethink.xxx.de)
 * Catalogue server (catalogue.participate.rethink.xxx.de)
 * Stub Server (stub.participate.rethink.xxx.de)
* Global Registry (greg.participate.rethink.xxx.de) - Note that the Global Registry can be provided by a CSP but is functionaly independant from the applications. I would suggest greg.participate.rethink.xxx.de -  
The TalkNow domain should provide the following servers (and associated sub-domains):  
* TalkNow Webserverhosting the TalkNow App (talknow.rethink.xxx.de)
 * Matrix Messaging Node (msg-node.talknow.rethink.xxx.de)
 * Domain Registry (dreg.talknow.rethink.xxx.de)
 * Catalogue server (catalogue.talknow.rethink.xxx.de)
 * Stub Server (stub.talknow.rethink.xxx.de)
* Global Registry (greg.talknow .rethink.xxx.de) - Same remark-   
The global domain should provide the following servers (and associated sub-domains):  
* Identity provider (ideasy.rethink.xxx.de)  
Phase 2  
 * Media Server for conferences

##### Enterprise conversational 
This scenario provides two apps (SmartBusinessApp, and SmartBusinessApp Customer) and several IdPs (EnergyQ, HyDev)
The following domains should be provided:  
* powercommunication.rethink.orange-labs.fr
Following servers (and associated sub-domains) should be provided:  
 * Application server (app.powercommunication.rethink.orange-labs.fr)
 * nodejs Messaging Node (msg-node.powercommunication.rethink.orange-labs.fr)
 * Domain Registry (registry.powercommunication.rethink.orange-labs.fr)
 * Catalogue server (catalogue.powercommunication.rethink.orange-labs.fr)
* IdP Server (energyq.rethink.orange-labs.fr, hydev.rethink.orange-labs.fr, )
* netall.rethink.orange-labs.fr  
* QoS Service Broker Service (broker.rethink2.orange-labs.fr)
* Global Registry
* TURN/STUN server
* Nodejs runtime + MCU server

##### Address book
 * at least one node of Global Registry
 * at least one CSP with a catalog

### Domain entries required, and applications provided on each
We consider that generally a CSP provides specific features that are hosted on the same place and provide sub domains:
 * node, 
 * domaine registry,
 * catalogue,
 * identity management (not to be mixed with IdP)

####*.rethink.ptinovacao.pt  
Applications:  
* hybroker: CSP and IdP (port 80 and 443)  
The different features of the CSP are provided in a subdomain (node.hybroker, registry.hybroker, catalogue.hybroker, idm.hybroker).  
hysmart is providing Hyperties related with IoT: CSP (probably port 443)  
* iHacker is an IdP (port 443)  

####My City domain : to be determined, Fokus or DT hosting  

####*.rethink.xxx.de: to be determined, Fokus or DT hosting  

####*.rethink.orange-labs.fr  
Applications:  
 * CSP powercommunication (ports 80, 443)
 * CSP energyq (ports 80, 443)
 * MCU Server -to be determined-
 * Global registry node (port 443).

####*.rethink2.orange-labs.fr  
Applications:  
 * TURN/STUN server (ports 443, 3478, 3479, 5349, 5350, to be confirmed)

####*.rethink3.orange-labs.fr  
Applications :  
 * QoS Service broker
 * netall

####Global registry
The global registry is dispatched on different domains (probably on orange-labs.fr, ptinovacao.pt, xxx.de). It can be independent of the CSPs or included. Each global registry node is linked in a way or another to the others, a CSP should be provided with at least one GR address (by configuration).


![applis](https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/rethinkTestbed-GlobalView.png)

## Testbed Description

*Please provide a description of the testbed per node per partner.  Include a figure for your node as well.*

### Description of Fraunhofer node
*add text and figures here*
![](https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/reThinkTestbed-Fokus-Node1.png)
### Description of PTIN node
*add text and figures here*
![PTIN](https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/rethink_PTIN_Node.png)

### Description of Orange node
![Orange Testbed](https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/reThinkTestbed-Orange.png)

So far deployed:
#### 1st VM - v-rethink1
![Orange Testbed](https://github.com/reTHINK-project/testbeds/blob/master/docs/Testbed-Design/figures/orangeLabsNode1.png)
 * IdP based on Node.js https://energyq.idp.rethink.orange-labs.fr/ (sources in https://github.com/reTHINK-project/dev-IdPServer)
   * proxy accessible https://energyq.idp.rethink.orange-labs.fr/.well-known/idp-proxy/rethink-oidc
   * Dockerfile available
   * Available test accounts
    *  

 * Domain Registry available on https://registry.powercommunication.rethink.orange-labs.fr (sources https://github.com/reTHINK-project/dev-registry-domain) 
    
 * Catalogue available on https://catalogue.powercommunication.rethink.orange-labs.fr 
 
 * Messaging Node available on https://msg-node.powercommunication.rethink.orange-labs.fr 
  
 * Global registry node available on https://greg.rethink.orange-labs.fr (sources https://github.com/reTHINK-project/dev-registry-global)

* Demo client available https://powercommunication.rethink.orange-labs.fr and https://energyq.rethink.orange-labs.fr
  

#### on 2nd VM

* QoS broker is available [here](https://broker.rethink2.orange-labs.fr/dashboard.html) (sources https://github.com/reTHINK-project/dev-qos-broker). A login and password are required to administrate this platform (brokeradmin/brokerAdmin).

#### on 3rd VM

#### on 4th VM - OIDC ServerInstance
 * IdP based on php https://oidc-ns.kermit.orange-labs.fr (sources in https://github.com/reTHINK-project/dev-IdPServer-phpOIDC)
   * proxy accessible https://oidc-ns.kermit.orange-labs.fr/.well-known/idp-proxy/rethink-oidc-ns
   * No docker file
   * Generation of GUID: https://oidc-ns.kermit.orange-labs.fr/GUID-demo/  
 
### Description of DTAG node
*add text and figures here*
