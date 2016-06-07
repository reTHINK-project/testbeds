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
  * "The catalogue service should provide fast response times. As querying the Catalogue occurs before an end-to-end communication is established, response times have no immediate impact on an established end-to-end communication."
  * "The catalogue service shall allow discovering the information it stores."
The KPIs *response time* and *request (and response) rate* are suitable indicators to assess those non-functional requirements.

**Average Response Time**

**Average Request and Response Rate**

###### Tests
Description of test set up, may be a single set up or multiple set ups depending on the component under test and the metric being tested.
If you have a single test set-up, describe the test set up first and then include one sub-section per metric being tested.  If you need several different test set ups, use a "strucutre by metric", i.e., have one subsection per metric which in turn includes the description of the test set up for that metric and the results.

###### References
**Please decide if references are to be included per section or if these references need to be moved into a dedicated section when integrating the contributions**

[D4.1] Management and Security features specifications, reTHINK Deliverable D4.1.  reTHINK consortium, September 2015.

