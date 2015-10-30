FROM rethink/testbed-baseline

#FROM rethink-testbed-baseline-docker-image
MAINTAINER marc.emmelmann@fokus.fraunhofer.de

RUN apt-get update -y && apt-get install -y maven git default-jre default-jdk openjdk-7-jre openjdk-7-jdk

RUN mkdir /opt/reTHINK
RUN cd /opt/reTHINK && git clone https://github.com/eclipse/leshan.git
RUN cd /opt/reTHINK/leshan && mvn install

CMD echo "LESHAN basic installation from github, including mvn install on leshan code, all code is unter /opt/reTHINK"

