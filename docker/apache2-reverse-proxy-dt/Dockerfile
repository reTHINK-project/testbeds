# docker image for a baseline installation of a reverse proxy
# using apache2 virtual hosts functionality.
#
# this docker images provides everything except the configuration
# of the actual reverse proxying (virtual hosts config)
#

FROM rethink/testbed-apache2-reverse-proxy-baseline

MAINTAINER steffen.druesedow@telekom.de

COPY apache-sites-available/010-reThink-DTNode.conf /etc/apache2/sites-available/010-reThink-DTNode.conf
RUN mkdir -p /opt/certs
RUN mkdir -p /opt/certs/stable
RUN mkdir -p /opt/certs/dev
COPY keys/stable/server-stable.crt /opt/certs/stable/server-stable.crt
COPY keys/stable/server-stable.key /opt/certs/stable/server-stable.key
COPY keys/stable/chain.pem /opt/certs/stable/chain.pem
COPY keys/dev/server-dev.crt /opt/certs/dev/server-dev.crt
COPY keys/dev/server-dev.key /opt/certs/dev/server-dev.key
COPY keys/dev/chain.pem /opt/certs/dev/chain.pem

RUN a2ensite 010-reThink-DTNode.conf
RUN a2enmod proxy_wstunnel
RUN a2enmod ssl
RUN a2enmod headers


# Note: the ENTRYPOINT is inherited from the baseline image, i.e.,
# the apache2 deamon is (re)started automatically when the image is started.
#
#ENTRYPOINT ["/usr/sbin/apache2ctl", "-DFOREGROUND"]
