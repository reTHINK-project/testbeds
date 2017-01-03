#!/bin/bash
# set CLEARFLAG to "--clear" in order to delete the persisted subscription data

DOMAIN=rethink.tlabscloud.com

docker rm nomatrix

# prepare a folder to hold the persistent storage
mkdir -p /opt/rethink/storage
chown -R $USER:$USER /opt/rethink/storage

if [ "$1" == "local" ]; then
	LOCALPARAM="-v /opt/rethink/dev-msg-node-nomatrix:/opt/volume/nomatrix --entrypoint /bin/bash "
fi
docker run -it --name nomatrix --net=rethink -p 8001:8001 \
	-e "DOMAIN=$DOMAIN" \
	-e "PORT=8001" \
	-e "REGISTRY=http://dev-registry-domain:4567" \
	-e "GLOBALREGISTRY =http://130.149.22.133:5002" \
	-e "CLEARFLAG=" \
	-v /opt/rethink/storage:/opt/rethink/storage \
	$LOCALPARAM \
	dev-msg-node-nomatrix
