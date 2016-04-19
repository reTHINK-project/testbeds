## Constrains per Node

As part of the Aveiro face-to-face meeting, an initial design and requirements towards the reThink
testbed nodes was presented ([presented slides](https://bscw.rethink-project.eu/bscw/bscw.cgi/d25103/Initial%20thoughts%20on%20Test%20Bed%20and%20Integration%20and%20Validation%20--%20Fraunhofer%20FOKUS%20Presentation.pdf)).  This documents captures deployment constrains for each testbed node.

*Please add any missing aspects / constrains that are relevant for your node.  The quesitons listed below should merely act as
a starting point.*

### Fraunhofer node / deployment constrains

* Will the testbed be accessible from outside the node premises via public IP?:  yes
* Number of available public IP-addresses:  1 public IPv4-address
* Access to the node:
    * Who will be allowed to have root-access to the node?:  local admins of node partner only
    * How can the node be accessed?:  personalized (public key based) login for reThink project partners only
    * Responsibilities / leagal constrains:
        * Project partner is responsible for deployed components und his/her account
    * Other
        * Not clear at this moment if external users (e.g. hackatron user) may deploy data (e.g. upload Hyperty descirptions)
          via deployed components


### Orange node / deployment constrains

* Will the testbed be accessible from outside the node premises via public IP?:  yes
* Number of available public IP-addresses:  3, plus virtual hosts and DNS.
* Access to the node:
    * Who will be allowed to have root-access to the node?:  local admins only
    * How can the node be accessed?: No ssh access from Internet, but the proxy to virtualized nodes can be personalized for reThink project partners only.
     * Access throught http is possible althought all ports are not available (80, 8080, 443 are ok, others are subject to test/validation). The use of Apache Virtual Nodes allows to use the same IP with the same port for diffrent containers as long as the FQDN is different.
    * Responsibilities / leagal constrains:
        * Project partner is responsible for deployed components und his/her account
    * Other
        * The testbed will be accessible through a DNS, reverse proxyfied with an instance of OSA (https://github.com/zorglub42/OSA/ ) based on apache 2.4 (possibility to proxyfy websockets)


### DTAG node / deployment constrains

* Will the testbed be accessible from outside the node premises via public IP?:  yes
* Number of available public IP-addresses:  1 public IPv4-address
* Access to the node:
    * Who will be allowed to have root-access to the node?:  local admins of node partner only
    * How can the node be accessed?:  personalized (public key based) login for reThink project partners only
    * Responsibilities / leagal constrains:
        * Project partner is responsible for deployed components und his/her account
    * Other
        * Not clear at this moment if external users (e.g. hackatron user) may deploy data (e.g. upload Hyperty descirptions)
          via deployed components

###PTIN node / deployment constrains

* Will the testbed be accessible from outside the node premises via public IP?: yes
* Number of available public IP-addresses:  2 public IPv4-addresses
* Access to the node:
    * Who will be allowed to have root-access to the node?:  local admins of node partner only, local sudo configuration available on demand via request from reThink partners only
    * How can the node be accessed?:  personalized (public key based) login for reThink project partners only
    * Access throught http/https is possible using standard ports 80 and 443, other ports will have access denied.
    * Responsibilities / leagal constrains:
        * Project partner is responsible for deployed components in its provided account
    * Other
