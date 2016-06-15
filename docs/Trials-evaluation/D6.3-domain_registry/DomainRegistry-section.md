#Component Description
The Domain Registry is the component of reThink’s architecture that together with the Global Registry, forms the Registry Service. The Global Registry provides a mapping from a User’s Unique Id (GUID) to the several services it uses. Each Communication Service Provider (CSP) runs a Domain Registry service that resolves domain-dependent user identifiers to the actual information about this user’s Hyperty Instances (a Hyperty used by a user in one device).

A Domain Registry stores, for each user identifier, the list of Hyperty Instances the user runs on his devices. It also stores, for each Hyperty Instance, the data that enables other applications to contact it, by providing a mapping between the identifier for each Hyperty Instance and the data that characterizes it. It also enables a user's hyperties to be searched for using several parameters [reference to user manual](https://github.com/reTHINK-project/dev-registry-domain/blob/master/docs/DomainRegistryUserManual.md).

The Domain Registry is a critical service as it stands in the critical path for call establishment. As it will be used very often, it must provide a low access time, high availability and be capable of fast updates (e.g. for when a device changes IP address). It is based on the client-server model and handles high-speed and high-frequency data.

#Metrics
Given the Domain Registry requeriments presented in the previous section, the following metrics must be evaluated in order to determine the suitability of an implementation:
- Response time for read - As the Domain Registry is a critical component in the call establishment process, the time it takes to performe a read should be small, in the order of the tens of ms. We will test the evolution of this metric as the load on the server increases.
- Number of concurrent requests - A large Service Provider is expected to have a large number of users, which will result in a high number of requests to the Domain Registry. Thus the domain registry should be able to scale to acomodate a large number of requests/s while providing a reasonable response time.
- Response time for write - The device runtime will write to the Domain Registry whenever new hyperties are deployed, removed or updated. Although not as critical, the response time should also be within tens of ms.
- Error rate - Measured in percentage of the requests that fail to be succesfully replied to within the timeout period (defined as 5s). This value should be zero.

#Tests
The Domain Registry was evaluated using an HTTP stress tool and a high-availability setup.

##Evaluation scenario
This section describes the test setup.

###Domain Registry deployment

The Domain Registry was deployed on [Google Cloud Plataform](https://cloud.google.com/compute/) [St. Ghislain, Belgium](https://cloud.google.com/about/locations/#locations) datacenter, using 8 VM with 1vCPU and 2GB RAM each. The VMs were assigned the roles described in Figure 1: 4 Cassandra DB nodes, 3 application servers and a single load balancer. Figure 1 presents 2 Load Balancers for redundancy purposes, but as a single one is active at any given time, only one was used for the performance tests.
All request are sent to the load balancer, that distributes them in round-robin through the 3 application servers. Application servers query the 4 database servers also using round-robin.

The Operating System used as [Ubuntu 14.04 64bit](http://releases.ubuntu.com/14.04/) and the software was deployed using [Docker](https://www.docker.com/) 1.6.2.
The load balancer uses [haproxy](http://www.haproxy.org/) 1.5.
The [Cassandra DB](http://cassandra.apache.org/) was deployed using version 3.5 with a replication factor of 3.
The application server was deployed using the [Spark micro framework](http://sparkjava.com/) 2.2. The Domain Registry version used was [R 0.2.0](https://github.com/reTHINK-project/dev-registry-domain/releases/tag/R0.2.0).

###Client tool
The tests were performed using [AutoBench](http://www.xenoclast.org/autobench/) 2.1.1 as a wrapper around [HTTPPerf](http://www.labs.hpe.com/research/linux/httperf/) 0.9.0.
These tools were run on a server with 2 Intel(R) Xeon(R) CPU E5-2640 v2 @ 2.00GHz CPUs (total of 32 cores), 128GB of RAM running Debian 8.2.

[Figure 1 - Deployment architecture](app_db.pdf)



##Test methodology
Two types of tests were performed: performance and scalability tests, where the load is varied; failure recovery testes, where one of 3 servers is failed and then put back online.

The performance and scalability tests were conducted using 1, 2 and 3 application servers (as depicted in the left side of Figure 2). The number of database servers was always 4 in order to maintain the data availability. For each number of servers, 10 httpperf tests were conducted (using autobench) varying the rate from 200 requests/s up to 2.000 request/s with a step of 200 requests/s. Each HTTP connection was used to issue 10 requests (*num_call*) and 2.000 connection (*num_conn*) were used, totalling 20.000 HTTP requests per test point.

The following autobench command was used for these tests:

``` autobench --single_host --host1 my.server --port1 4567 --uri1 /hyperty/user/userid@inesc-id.pt --low_rate 20 --high_rate 200 --rate_step 20 --num_call 10 --num_conn 2000 --timeout 5 ```

[Figure 2 - Test scenarios](test_scenarios.pdf)

The application server failure test was conducted using a scenario with 3 application servers, where one of them was disabled (with a *docker rm -f*) and latter restarted. The goal was to measure the impact of the node leaving (including failure detection) and rejoining the set of nodes used by the haproxy load balancer. This test is depicted in the top right part of Figure 2.

Every test was repeated 50 times. Each data point is the average of all these runs.
The tests are interleaved and were performed over the length of a few days to prevent eventual effects due to time of day network and VMs traffic.

##Response time

Httperf presents some performance limitation that must be taken into account in order to understand the results obtained. In particular, httperf limits the number of concurrent connections (due to file descriptor limits). If the server is unable to keep up with the request rate, httperf will eventually run out of TCP connections and will be unable to sustain the request rate.
Figure 3 presents the relation between the solicited request rate and the effective request rate. We can see that with 3 servers, httperf is capable of imposing a request rate close to the solicited rate up to 800 req/s. 



[Figure 3 - Effective vs solicited request rate](req_performed_9june.pdf)

[Figure 4 - Average response time](avg_times_9june.pdf)

#Error rate
não houve erros de não chegar resposta. apenas timeout > 5s mas resposta chegou
[Figure 5 - Error rate](errors_9june.pdf)

##Failure recovery test

[Figure 6 - ](failure_1_node_june.pdf)



#Future work

avaliar  estatisticamente significativo.

BD falhas

Haproxy e floating IP

Misturar escritas e leituras
e capable of fast updates

1 pedido por ligação

https

tudo no mesmo datacenter
