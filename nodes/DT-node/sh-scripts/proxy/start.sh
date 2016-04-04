#!/bin/sh

echo "starting reverse proxy ..."
docker ps | grep proxy

if [ $? -eq 0 ]; then
	echo "proxy container already started ... "
else 
	echo "starting proxy container in a screen session ..." 
	screen -d -m -S proxy /opt/rethink/testbeds/docker/apache2-reverse-proxy-dt/start-proxy.sh
	echo DONE!
fi
