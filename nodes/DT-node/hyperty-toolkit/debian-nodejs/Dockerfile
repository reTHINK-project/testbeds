FROM debian:jessie

# Maintainer
MAINTAINER Steffen Drüsedow <steffen.druesedow@telekom.de>

RUN export DEBIAN_FRONTEND=noninteractive \
    && apt update -y \
    && apt upgrade -y 

RUN export DEBIAN_FRONTEND=noninteractive \
    && apt install -y \
    curl vim git \
    && apt-get clean

# add nodejs repo
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -

RUN apt install -y nodejs

