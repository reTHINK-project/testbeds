#!/bin/sh

echo "starting registry ..."
docker ps | grep dev-registry-domain

if [ $? -eq 0 ]; then
	echo "registry container already started ... "
else 
	cd /opt/rethink/dev-msg-node-matrix/dist/docker
	screen -d -m -S registry ./startregistry.sh
	cd -
fi
