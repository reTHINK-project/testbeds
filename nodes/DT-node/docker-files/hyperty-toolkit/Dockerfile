FROM debian-nodejs-base:latest

# Maintainer
MAINTAINER Steffen Drüsedow <steffen.druesedow@telekom.de>

RUN echo "#!/bin/sh \n export HYPERTY_REPO=hyperty \n cd /hyperty-toolkit && npm start || /bin/bash" > /start.sh
RUN chmod +x /start.sh

# startup configuration
ENTRYPOINT ["/start.sh"]
VOLUME ["/hyperty-toolkit"]

