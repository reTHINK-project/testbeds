#!/bin/sh

echo "starting matrix messaging node ..."
docker ps | grep matrix

if [ $? -eq 0 ]; then
	echo "matrix container already started ... "
else 
	echo "starting matrix container in a screen session ..." 
	screen -d -m -S matrix /bin/sh -c "/opt/rethink/dev-msg-node-matrix/dist/docker/start.sh && /bin/bash"
	echo "The Matrix container is now running detached in background ---> starting a console for monitoring purposes!"
fi

