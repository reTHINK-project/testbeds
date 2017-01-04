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
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -

RUN apt install -y nodejs

ADD input/start.sh /start.sh
#RUN echo "#!/bin/sh \n export HYPERTY_REPO=hyperty \n cd /hyperty-toolkit && if [ -d ./node_modules ] then npm install; npm start; else npm start; fi || /bin/bash" > /start.sh
#RUN chmod +x /start.sh

# startup configuration
ENTRYPOINT ["/start.sh"]

