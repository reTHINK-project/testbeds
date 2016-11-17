FROM debian:jessie
MAINTAINER Kay Hänsge <kay.haensge@telekom.de>
# script based on https://github.com/synctree/docker-coturn/blob/master/Dockerfile

# XXX: Workaround for https://github.com/docker/docker/issues/6345
#RUN ln -s -f /bin/true /usr/bin/chfn

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
            coturn \
            curl \
            procps \
            --no-install-recommends

ADD turnserver.sh /turnserver.sh

# patching turnserver.conf
RUN sed -i "s/#lt-cred-mech/lt-cred-mech/" /etc/turnserver.conf
RUN sed -i "s/#user=username2:password2/user=rethink:rethink/" /etc/turnserver.conf 
RUN sed -i "s/#realm=mycompany.org/realm=rethink.tlabscloud.com/" /etc/turnserver.conf 

EXPOSE 3478 3478/udp
CMD ["/bin/sh", "/turnserver.sh"]

