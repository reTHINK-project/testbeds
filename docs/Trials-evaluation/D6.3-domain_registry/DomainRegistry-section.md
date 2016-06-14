#Component Description
The Domain Registry is the component of reThink’s architecture that together with the Global Registry, forms the Registry Service. The Global Registry provides a mapping from a User’s Unique Id (GUID) to the several services it uses. Each Communication Service Provider (CSP) runs a Domain Registry service that resolves domain-dependent user identifiers to the actual information about this user’s Hyperty Instances (a Hyperty used by a user in one device).

A Domain Registry stores, for each user identifier, the list of Hyperty Instances the user runs on his devices. It also stores, for each Hyperty Instance, the data that enables other applications to contact it, by providing a mapping between the identifier for each Hyperty Instance and the data that characterizes it. It also enables a user's hyperties to be searched for using several parameters [reference to user manual](https://github.com/reTHINK-project/dev-registry-domain/blob/master/docs/DomainRegistryUserManual.md).

The Domain Registry is a critical service as it stands in the critical path for call establishment. As it will be used very often, it must provide a low access time, high availability and be capable of fast updates (e.g. for when a device changes IP address). It is based on the client-server model and handles high-speed and high-frequency data.

#Metrics
Given the Domain Registry requeriments presented in the previous section, the following metrics must be evaluated in order to determine the suitability of an implementation:
- Response time for read - As the Domain Registry is a critical component in the call establishment process, the time it takes to performe a read should be small, in the order of the few ms. We will test the evolution of this metric 
- Response time for write
- Error rate
- Error rate during failure recovery

#Tests

##Evaluation scenario

hw e sw



[Figure 1 - Deployment architecture](app_db.pdf)

[Figure 2 - Test scenarios](test_scenarios.pdf)

##Test setup

[Figure 3 - ](req_performed_9june.pdf)


##Response time

[Figure 4 - Average response time](avg_times_9june.pdf)

#Error rate
não houve erros de não chegar resposta. apenas timeout > 5s mas resposta chegou
[Figure 5 - Error rate](errors_9june.pdf)

##Failure recovery test

[Figure 6 - ](failure_1_node_june.pdf)



#Future work

BD

Haproxy e floating IP

Misturar escritas e leituras
e capable of fast updates



