Performance tests of the Domain Registry were already provided in Deliverable 6.3. 
The tests described in that document demonstrate the ability of the Domain Registry implementation to scale in order to handle a large number of clients.
The scalability is provided by the deployment architecture, where the number of nodes processing the requests as well as the number of nodes that make up the database can be adjusted according to the expected load.

In this document, we complement the previous scalability evaluation with an evaluation of the high availability performance. The deployment architecture is still the same, ilustrated in the following Figure:
[Figure 1 - Deployment architecture](https://github.com/reTHINK-project/testbeds/blob/master/docs/Trials-evaluation/D6.3-domain_registry/app_db.pdf)


The Domain Registry was deployed on a datacente of the University of Lisbon’s Tagus Park datacenter, using 9 VM with 1vCPU and 2GB RAM each. The VMs were assigned the roles described in Figure 1: 4 Cassandra DB nodes, 3
application servers and a 2 load balancers in active/passive configuration. All requests are sent to the
load balancer, that distributes them in round-robin through the 3 application servers.
The Operating System used was Ubuntu 14.04 64bit and all software was deployed using Docker
1.6.2. The load balancers uses haproxy 1.5. The Cassandra DB was deployed using version 3.5 with a
replication factor of 3. The application server was deployed using the Spark Java framework 2.2. The
Domain Registry version used was R 0.2.0.
The load testing tools were run on a server with 2 Intel(R) Xeon(R) CPU E5-2640 v2 @ 2.00GHz
CPUs (total of 32 cores), 128GB of RAM running Debian 8.2.
After reviewing and testing several open source load testing applications, we ended up choosing [httperf 2](http://www.labs.hpe.com/research/linux/httperf/) to simulate the client load.

There are two load balancers. The master node handles all the requests and the backup node is in standby mode.
When the backup node detects a failure of the master, it assumes its role.
This is accomplished by using the Virtual Router Redundancy Protocol (VRRP) running between the two nodes.
A single IP address is shared by both nodes, but only the master announces it.
Under normal conditions, all the requests are sent to the Master.
When the backup stops receiving VRRP announcements from the Master, it assumes it is down and takes over the shared IP address and operation.
When the Master is back online, the Slave relinquishes control of the shared IP address.
[Keepalived](http://www.keepalived.org/) was used to implement VRRP and the fail-over behaviour.

We simulated two types of Master node failure: failure of the service provided by the node (haproxy) and failure of the fail-over mechanism itself (keepalived).
[Figure 2](https://github.com/reTHINK-project/testbeds/blob/master/docs/Trials-evaluation/D6.4-Domain_registry/keepalived_ha.pdf) illustrats the failure of the service provided by the node.
In this case, after about 20s, we stop the haproxy service on the Master node.
There is a service failure that last about 5s. After 5s, the service is resumed by the Backup node.
We set keepalived to monitor Haproxy every 5 seconds. That is why there is a 5 second gap until the Backup node takes over.
However, this value was used just for testing to actually see the transition. In production this
value will be decreased to 2 seconds. That was the only value that was manually set by us.
At arround 40s, we restart the haproxy service on the Master node.
While assuming the server role, if the backup node ever starts receiving VRRP advertisements again, it elects the first node as master (because the master was set up with a higher priority level) and transits back to being the backup node, in a always listening, passive configuration.
The transition back to the Master node is faster. The brief failure in the service is due to the fact that as the IP address changes, ongoing TCP connections are dropped, as these were started with the Backup node but the Master server does not know them, thus rejecting those packets. 
All new connections will proceed normally.

[Figure 3](https://github.com/reTHINK-project/testbeds/blob/master/docs/Trials-evaluation/D6.4-Domain_registry/keepalived_keep.pdf) shows a similar test, but this time we stop the failover service (keepalived) on the Master node.
This time the service interruption is shorter, as the Backup node stops receiving the VRRP announcements as soon as the keepalived service is stoped.
The return of the control to the Master node is simillar to the previous case: when the keepalived service is resumed, it starts sendin 


Testing the failover mechanism of Haproxy was done using a curl script. We run
the script during 60s and after ≈ 20 seconds we stopped first the Haproxy (Figure 5.7) and then the
keepalived process (Figure 5.8) on master node. Regarding the load balancer fail,  The other
three transitions that we see on both Figure 5.7 and 5.8 are related to VRRP advertisements. When
the backup node stops receiving this advertisements it claims the shared IP address and becomes
the master node (Figure 5.8). While assuming the master node role, if the backup node ever starts
receiving VRRP advertisements again, it elects the first node as master (because the master was set
up with a higher priority level) and transits back to being the backup node, in a always listening, passive
configuration (second transition of both Figure 5.8 and 5.7).
