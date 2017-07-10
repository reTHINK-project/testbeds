Performance tests of the Domain Registry were already provided in Deliverable 6.3. 
The tests described in that document demonstrate the ability of the Domain Registry implementation to scale in order to handle a large number of clients.
The scalability is provided by the deployment architecture, where the number of nodes processing the requests as well as the number of nodes that make up the database can be adjusted according to the expected load.

In this document, we complement the previous evaluation with new elements. The deployment architecture is still the same, ilustrated in the following Figure:
[Figure 1 - Deployment architecture](app_db.pdf)


The Domain Registry was deployed on a datacente of the University of Lisbon’s Tagus Park datacenter, using 9 VM with 1vCPU and 2GB
RAM each. The VMs were assigned the roles described in Figure 1: 4 Cassandra DB nodes, 3
application servers and a 2 load balancers in active/passive configuration. All requests are sent to the
load balancer, that distributes them in round-robin through the 3 application servers.
The Operating System used was Ubuntu 14.04 64bit and all software was deployed using Docker
1.6.2. The load balancer uses haproxy 1.5. The Cassandra DB was deployed using version 3.5 with a
replication factor of 3. The application server was deployed using the Spark Java framework 2.2. The
Domain Registry version used was R 0.2.0.
The load testing tools were run on a server with 2 Intel(R) Xeon(R) CPU E5-2640 v2 @ 2.00GHz
CPUs (total of 32 cores), 128GB of RAM running Debian 8.2.

After reviewing and testing several open source load testing applications, we ended up choosing [httperf 2](http://www.labs.hpe.com/research/linux/httperf/) to simulate the clients.


