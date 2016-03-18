# Basic nagios installation that includes reTHINK specific
# configuration, e.g. config for hosts to monitor.
#
# Attentention: this image uses default passwords for
# nagios administration. Please derive your own image
# from this one and secretly set the passwords.
# An example on how to do this is given in the nagios docker file
# provided in the github rethink/testbeds repository.
#
FROM rethink/nagios-baseline:dev
MAINTAINER marc.emmelmann@fokus.fraunhofer.de

# Create a /opt/reTHINK dir
# all project specific stuff should be put in subdirectories (!!!)
# below this path

# just verify that nagios is there :-)
RUN cd /opt/nagios

# copy (recursively) the config files aside this Docker file to /
COPY opt /

