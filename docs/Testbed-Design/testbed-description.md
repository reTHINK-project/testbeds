
##Testbed requirements
### Requirements from D5.1
#### Smart Contextual assistance:
The following domains should be provided:
 * hybroker.rethink.ptinovacao.pt
 * hysmart.rethink.ptinovacao.pt
 * iHacker.rethink.ptinovacao.pt  
HyBroker should provide the following servers (and associated sub-domains):  
 * Vertx messaging node (node.broker.rethink.ptinovacao.pt)
 * Domain registry (registry.broker.rethink.ptinovacao.pt)
 * Catalogue server (catalogue.broker.rethink.ptinovacao.pt)
 * IdM server (idm.broker.rethink.ptinovacao.pt)
 * Global registry
 * TURN/STUN server

#### Hotel Guest
The testbed should have at least 3 virtual machines available for the Catalogue, the LWM2M Message Node and the Identity Manager Server/Identity Management Subsystem. The number of docker images depends on the implementation of these components. All 3 services should be accessible via public IP, be it only one that is shared and then NAT-ed, or reverse proxyfied towards the docker instances running the services or having a separate public IP for each service. A DNS server with SRV entries is needed in order that the setup can be replicated on several testbeds.

#### My City
A <My City domain> is required for My City implementation.  
DT lab should provide the following servers (and associated sub-domains):  
 * Node.js Messaging Node (node.< My City domain >)
 * Domain Registry (registry.< My City domain >)
 * Catalogue server (catalogue.< My City domain >)
 * IdM Server (idm.< My City domain >)
 * Web server (web.< My City domain >)
 * Global Registry

#### Tourism in a smartcity
  * At least one messaging node 
  * At least one Domain Registry
  * At least one node of the Global Registry
  * At least one Catalog
  
#### Neigbourhood
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
* Stub Server (stub. participate.rethink.xxx.de)
* Global Registry (greg. participate.rethink.xxx.de)  
The TalkNow domain should provide the following servers (and associated sub-domains):  
* TalkNow Webserverhosting the TalkNow App (talknow.rethink.xxx.de)
* Matrix Messaging Node (msg-node.talknow.rethink.xxx.de)
* Domain Registry (dreg.talknow.rethink.xxx.de)
* Catalogue server (catalogue.talknow.rethink.xxx.de)
* Stub Server (stub.talknow.rethink.xxx.de)
* Global Registry (greg.talknow .rethink.xxx.de)  
The global domain should provide the following servers (and associated sub-domains):  
* Identity provider (ideasy.rethink.xxx.de)  
Phase 2  
 * Media Server for conferences

#### Enterprise conversational 
The following domains should be provided:  
* powercommunication.rethink.orange-labs.fr
* energyq.rethink.orange-labs.fr
* netall.rethink.orange-labs.fr  
Following servers (and associated sub-domains) should be provided:  
* nodejs Messaging Node (node.powercommunication.rethink.orange-labs.fr)
* Domain Registry (registry.powercommunication.rethink.orange-labs.fr)
* Catalogue server (catalogue.rethink.orange-labs.fr)
* IdM Server (energyq.rethink.orange-labs.fr)
* QoS Service Broker Service (broker.netall.rethink.orange-labs.fr)
* Global Registry
* TURN/STUN server
* Nodejs runtime + MCU server
* Application server (app.powercommunication.rethink.orange-labs.fr)

#### Address book
 * at least one node of Global Registry
 * at least one CSP with a catalog

### Domain entries required
*.rethink.ptinovacao.pt

<Mycity domain> : to be determined, Fokus or DT hosting

*.rethink.xxx.de: to be determined, Fokus or DT hosting

*.rethink.orange-labs.fr

## Testbed Description

*Please provide a description of the testbed per node per partner.  Include a figure for your node as well.*

### Description of Fraunhofer node
*add text and figures here*

### Description of PTIN node
*add text and figures here*

### Description of Orange node
![Orange Testbed](https://cloud.githubusercontent.com/assets/10738516/11059983/8ed924c6-879d-11e5-8e1c-03b218465d88.png)

So far deployed:
#### 1st VM - p-rethink1
 * IdP based on Node.js http://idp.rethink.orange-labs.fr/ (sources in https://github.com/reTHINK-project/dev-IdPServer)
   * proxy accessible http://idp.rethink.orange-labs.fr/.well-known/idp-proxy/rethink-oidc
   * Dockerfile available
   * Available test accounts
    *  

 * Domain Registry available on https://coolapp.registry.rethink.orange-labs.fr (sources https://github.com/reTHINK-project/dev-registry-domain)
  *  
  
* Demo client available https://coolapp.rethink.orange-labs.fr 
  
#### on 4th VM - OIDC ServerInstance
 * IdP based on php https://oidc-ns.kermit.orange-labs.fr (sources in https://github.com/reTHINK-project/dev-IdPServer-phpOIDC)
   * proxy accessible https://oidc-ns.kermit.orange-labs.fr/.well-known/idp-proxy/rethink-oidc-ns
   * No docker file
 
### Description of DTAG node
*add text and figures here*
