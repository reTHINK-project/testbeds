# docker image for a baseline installation of a reverse proxy 
# using apache2 virtual hosts functionality.
#
# this docker images provides everythink except the configuration
# of the actual reverse proxying (virtual hosts config)
#

FROM rethink/apache2-reverse-proxy-baseline

MAINTAINER marc.emmelmann@fokus.fraunhofer.de




ADD ./apache-sites-available/010-reThink-fokusNode.conf /etc/apache2/sites-available
RUN a2ensite 010-reThink-fokusNode.conf 



RUN cd /opt/reTHINK && echo "/opt/reTHINK provided by rethink/testbed-baseline docker image ... yes"

ENTRYPOINT /etc/init.d/apache2 restart && echo "Started apache2 deamon for reverse proxing in the background\n String bash now" && /bin/bash


