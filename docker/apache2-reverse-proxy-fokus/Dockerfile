# docker image for a baseline installation of a reverse proxy 
# using apache2 virtual hosts functionality.
#
# this docker images provides everythink except the configuration
# of the actual reverse proxying (virtual hosts config)
#

FROM rethink/testbed-apache2-reverse-proxy-baseline

MAINTAINER marc.emmelmann@fokus.fraunhofer.de




ADD ./apache-sites-available/010-reThink-fokusNode.conf /etc/apache2/sites-available
RUN a2ensite 010-reThink-fokusNode.conf 



# Note: the ENTRYPOINT is inherited from the baseline image, i.e.,
# the apache2 deamon is (re)started automatically when the image is started.
# 

