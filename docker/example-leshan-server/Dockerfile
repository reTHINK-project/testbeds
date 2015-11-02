FROM rethink/example-leshan
MAINTAINER marc.emmelmann@fokus.fraunhofer.de

#
# Note:  the /tcp and /udp tags are ignored.  Exposed ports are always tcp UNLESS you
# specifc a port mapping via -p in docker run and tag the port as udp there
#

# expose port for web gui
EXPOSE 8080/tcp

# expose port of leshan server
EXPOSE 5683/udp
EXPOSE 5684/udp

# start the server
CMD cd /opt/reTHINK/leshan/leshan-standalone && java -jar target/leshan-standalone-*-SNAPSHOT-jar-with-dependencies.jar 


#
#
#
# you man run the docker image with
#	docker run -it --net=host --name=leshan-server-container leshan-server
#
# don't use the command below. just kept to work on how to make the image run behind local docker bridge. not yet completed.
#	 docker run  -it  -p 8080:8080/tcp -p 5683:5683/udp -p 5684:5684/udp --name=leshan-server-container  leshan-server
#

