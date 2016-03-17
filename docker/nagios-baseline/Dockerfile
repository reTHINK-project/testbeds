# docker image for a baseline installation of nagios
# to minitor if services at the testbed nodes are running
#
#
FROM rethink/testbed-baseline
MAINTAINER marc.emmelmann@fokus.fraunhofer.de


# RUN apt-get update -y && apt-get install -y apache2
# RUN apt-get update -y && apt-get install -y libapache2-mod-php5
# RUN apt-get update -y && apt-get install -y build-essential
# RUN apt-get update -y && apt-get install -y libgd2-xpm-dev

#RUN apt-get update -y && apt-get install -y nagios3 nagios-nrpe-plugin


#
# Install required packages
#
RUN apt-get update -y && apt-get install -y apache2 build-essential libgd2-xpm-dev apache2-utils unzip wget

#
# Add nagios user and group
#
RUN /usr/sbin/useradd -m -s /bin/bash --password ENCRYPTEDPASSWORD  nagios
RUN /usr/sbin/groupadd nagcmd

RUN /usr/sbin/usermod -a -G nagcmd nagios
RUN /usr/sbin/usermod -a -G nagcmd www-data

#
# download packages
#
RUN cd /opt && mkdir downloads
RUN cd /opt/downloads && wget https://assets.nagios.com/downloads/nagioscore/releases/nagios-4.1.1.tar.gz
RUN cd /opt/downloads && wget http://www.nagios-plugins.org/download/nagios-plugins-2.1.1.tar.gz
RUN cd /opt/downloads && gunzip nagios-4.1.1.tar.gz
RUN cd /opt/downloads && gunzip nagios-plugins-2.1.1.tar.gz

# alternatively, copy our backup of the tar balls
# COPY ./downloads/nagios-4.1.1.tar /opt/downloads
# COPY ./downloads/nagios-plugins-2.1.1.tar /opt/downloads

#
# install nagios core
#
RUN cd /opt/downloads && tar xvf nagios-4.1.1.tar
RUN cd /opt/downloads/nagios-4.1.1 && ./configure --prefix=/opt/nagios --with-httpd-conf=/etc/apache2/conf-available  --with-command-group=nagcmd

RUN cd /opt/downloads/nagios-4.1.1 && make all
RUN cd /opt/downloads/nagios-4.1.1 && make install
RUN cd /opt/downloads/nagios-4.1.1 && make install-init
RUN cd /opt/downloads/nagios-4.1.1 && make install-config
RUN cd /opt/downloads/nagios-4.1.1 && make install-commandmode


RUN cd /opt/downloads/nagios-4.1.1 && make install-webconf
RUN ln -s /etc/apache2/conf-available/nagios.conf /etc/apache2/sites-enabled/nagios.conf


RUN echo "/opt/nagius provided by rethink/nagios-baseline docker image ... yes"

# ENTRYPOINT /etc/init.d/apache2 restart && echo "Started apache2 deamon for reverse proxing in the background\n String bash now" && /bin/bash

ENTRYPOINT /etc/init.d/apache2 restart && echo "Started apache2 deamon for nagios in the background\n String bash now" && /bin/bash

