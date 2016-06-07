##### Catalogue (Marc, Fokus)
###### Description of Component
~~Short description (1 paragraph, approx. 5-8 lines) describing the component under test~~

The Catalogue provides the service to store descriptors of Hyperties available for use. It also provides the means for the runtime to obtain (download) the implementation of a Hyperty and ProtocolStubs required for SigOFly after learning about a Hyperty from the Registry Service. [D4.1]

###### Metrics
~~Description of metrics used to test the components.  Should include:~~
  * ~~What is tested (i.e. metric description)~~
  * ~~For each metric:~~
    * ~~reasoning why this metric matters for the component under test~~
    * ~~expected performance (based on use cases under consideration, e.g. number of parallen interacting end-nodes, requests per second, delay of a querry-response, size of data exchanged etc; target values based on real-world deployments).~~

As the Catalogue Service merely stores  information and in particular does not need to manipulate any of the stored records, [D4.1] identifies the following two non-functional requirements which yield to measureable key performance indicators (KPIs):
  * "The catalogue service shall allow discovering the information it stores."
  * "The catalogue service should provide fast response times. As querying the Catalogue occurs before an end-to-end communication is established, response times have no immediate impact on an established end-to-end communication."

As the Catalogue offers in general a purely request-based service, the KPIs *request (and response) rate* and *response time* are suitable indicators to assess those non-functional requirements.  In addition, the number of *errors* per experiment are recorded.

Note that populating the Catalogue with new entires--comparable to updating the contents of a web site or within an app store as compared to retirieving the content--is a relativly rare event which the initial tests do not assess seperately.


**Average Request and Response Rate**

Evaluating the (average) request and response rate allows to assess the behavor of the system under test (SUT) for increasing load.  For the conducted performance evaluation, three rates are captured:
  * demanded request rate
  * actual request rate
  * actual response rate

The *demanded request rate* reflects the rate at which the testing device is demanded (i.e., configured) to send requests to the SUT.  Hence, the *demanded request rate* imposes an upper bound on the request rate used in the test; naturally, the *actual request rate* which reflects the requests that are actually sent from the testing device to the SUT may be lower.  The reason may be two-fold: the SUT is saturating and hence, the possible *actual response rate* limits the rate at which (new) requests can be sent; or the testing device is reaching its capability, due to performance limits, to generate new requests.  Which of the two cases applies may be easily checked by increasing the number of testing devices that are configured to impose in parallel loads at which for one testing device the actual request and response rates derivate from the demanted request rate.

**Average Response Time**

The **average response time** allows to assess how fast a reThink device may retrieve a response from the catalogue.  This metric directly reflects the user experience as accessing Catalogue service might cause the application or hyperty accessing it to wait for the response.  In order to mitigte the effects of the network delay on the reported response time, reported results should mention the round-trip-time between SUT and the testing device as, e.g., measured via ping.

**Errors**

The number of erros is recorded for each experiment in order to verify that reported measurements are not biased by any irregularities in the SUT, the testing device, or the communication between the latter two.  Errors checked for by the used testing tools consider [httperf-man]:
  * The number of times a session, connection, or call failed due to a client timeout.
  * The number of times a TCP connection failed with a socket−level timeout (ETIMEDOUT).
  * The number of times a TCP connection attempt failed with a "connection refused by server" error (ECONNREFUSED).
  * The number of times a TCP connection failed due to a RESET from the server. 
  * The number of times the httperf process was out of file descriptors. Whenever this count is non−zero, the test results are meaningless because the client was overloaded.
  * The number of times the client was out of TCP port numbers (EADDRNOTAVAIL). This error should never occur. If it does, the results should be discarded.
  * The number of times the system’s file descriptor table is full. Again, this error should never occur. If it does, the results should be discarded.

For purely assessing the performance of the SUT, the numbers of errors should be zero for each test.




###### Tests
~~Description of test set up, may be a single set up or multiple set ups depending on the component under test and the metric being tested.
If you have a single test set-up, describe the test set up first and then include one sub-section per metric being tested.  If you need several different test set ups, use a "strucutre by metric", i.e., have one subsection per metric which in turn includes the description of the test set up for that metric and the results.~~

**System under Test**

The system under test (SUT) comprises set-up of the catalogue as found in the reTHINK testbed deployment.  The goal of the performance assessment is not to obtain theoretically achievable performance numbers as could be achieved in a "clean room environment", i.e., connecting the testing devices immediately to a catalouge instance; but instead to assess the catalogue in an environment which will be faced by users during the upcoming hackathon event. Besides that this setup assures that a positive performance assessment indicates the catalogue's ability to provide sufficient performance for reTHINK-specific events and tests, the chosen setup is close to a real world deployment anticipated in operators' commercial networks.

Figure **XXX-01** visualizes the test setup.  It distinguishes between the SUT (i.e. the catalgue-specific set-up) and the testing devices (i.e., the machines running the test tools). 

![Image System Under Test (SUT) for the Catalogue Performance Evaluaton](./catalogue-fokus-performance-test-setup.png)
**Figure XXX-01: System under test (SUT) for the Catalogue performance assessment**

The testing devices are unix-based computers running autobench [autobench] and httperf [httperf].  The number of testing devices varies per experiment.  The testing devices are connected via Ethernet towards the SUT via an internal network, i.e., the public Internet is not included in the communication path.

Regarding the catalogue, the SUT comprises of:
  * one catalogue-broker;
  * one catalouge-database that contains example catalogue objects used for testing; 
  * two apache proxies, one being responsible for providing reverse-proxing while accessing the catalogue, and the other being responsible for securly hosting any certificates required for https-based access to the catalouge; and
  * one firewall.

For a detailed description of each component and how to set them up, please refer to [D6.1].


###### References
**Please decide if references are to be included per section or if these references need to be moved into a dedicated section when integrating the contributions**

[autobench]  Autobench GitHub Repository.  Available online: https://github.com/menavaur/Autobench; last accessed June 2016.

[D4.1] Management and Security features specifications, reTHINK Deliverable D4.1.  reTHINK consortium, September 2015.

[D6.1] Testbed specification, reTHINK Deliverable D6.1.  reTHINK consortium, April 2016.

[httperf]  Httperf GitHub Repository.  Available online: https://github.com/httperf/httperf; last accessed June 2016.

[httperf-man] Httperf Man Page.  Available online: http://www.labs.hpe.com/research/linux/httperf/httperf-man-0.9.ps; last accessed June 2016.

