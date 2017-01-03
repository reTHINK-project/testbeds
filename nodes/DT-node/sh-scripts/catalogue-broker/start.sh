#!/bin/sh

cd ${0%/*}
DIR=`pwd`

echo "starting catalogue broker .."
docker ps | grep catalogue-broker

if [ $? -eq 0 ]; then
	echo "the catalogue-broker container is already started ... "
else 
	echo "starting catalogue-broker container in a screen session ..." 
	screen -d -m -S catalogue-broker /bin/sh -c "$DIR/docker-start.sh"
	echo "The catalogue-broker container is now running detached in background"
fi


