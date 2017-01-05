# docker image for a baseline installation of a reverse proxy
# using apache2 virtual hosts functionality.
#
# this docker images provides everything except the configuration
# of the actual reverse proxying (virtual hosts config)
#

FROM ubuntu:14.04
MAINTAINER steffen.druesedow@telekom.de

RUN apt-get update -y

RUN apt-get install -y apache2 apache2-doc libapache2-mod-proxy-html

RUN a2enmod proxy
RUN a2enmod proxy_html
RUN a2enmod proxy_http


RUN mkdir -p /opt/certs
COPY keys/server.crt /opt/certs/server.crt
COPY keys/server.key /opt/certs/server.key

RUN a2enmod proxy_wstunnel
RUN a2enmod ssl
RUN a2enmod headers

COPY apache-sites-available/010-reThink-DTNode.conf /etc/apache2/sites-available/010-reThink-DTNode.conf
RUN a2ensite 010-reThink-DTNode.conf

ENTRYPOINT /usr/sbin/apache2ctl -DFOREGROUND
