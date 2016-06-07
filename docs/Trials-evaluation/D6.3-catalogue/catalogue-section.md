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
As the Catalogue offers in general a purely request-based service, the KPIs *request (and response) rate* and *response time* are suitable indicators to assess those non-functional requirements.  Note that populating the Catalogue with new entires--comparable to updating the contents of a web site or within an app store as compared to retirieving the content--is a relativly rare event which the initial tests do not assess seperately.

**Average Request and Response Rate**

Evaluating the (average) request and response rate allows to assess the behavor of the system under test (SUT) for increasing load.  For the conducted performance evaluation, three rates are captured:
  * demanded request rate
  * actual request rate
  * actual response rate
The *demanded request rate* reflects the rate at which the testing device is demanded (i.e., configured) to send requests to the SUT.  Hence, the *demanded request rate* imposes an upper bound on the request rate used in the test; naturally, the *actual request rate* which reflects the requests that are actually sent from the testing device to the SUT may be lower.  The reason may be two-fold: the SUT is saturating and hence, the possible *actual response rate* limits the rate at which (new) requests can be sent; or the testing device is reaching its capability, due to performance limits, to generate new requests.  Which of the two cases applies may be easily checked by increasing the number of testing devices that are configured to impose in parallel loads at which for one testing device the actual request and response rates derivate from the demanted request rate.

**Average Response Time**


###### Tests
Description of test set up, may be a single set up or multiple set ups depending on the component under test and the metric being tested.
If you have a single test set-up, describe the test set up first and then include one sub-section per metric being tested.  If you need several different test set ups, use a "strucutre by metric", i.e., have one subsection per metric which in turn includes the description of the test set up for that metric and the results.

###### References
**Please decide if references are to be included per section or if these references need to be moved into a dedicated section when integrating the contributions**

[D4.1] Management and Security features specifications, reTHINK Deliverable D4.1.  reTHINK consortium, September 2015.

