FROM debian:jessie
MAINTAINER Kay Hänsge <kay.haensge@telekom.de>


RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get install -y \
            git \
            curl 

ADD letsencrypt.sh /letsencrypt.sh

RUN git clone https://github.com/letsencrypt/letsencrypt

RUN cd /letsencrypt/ && ./letsencrypt-auto --help

RUN mkdir /var/log/letsencrypt/

EXPOSE 80
ENTRYPOINT ["/letsencrypt.sh"]
CMD ["renew"]

