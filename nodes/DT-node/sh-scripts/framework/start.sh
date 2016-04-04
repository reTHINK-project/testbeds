#!/bin/sh

echo "starting rethink service framework ..."
screen -ls | grep framework

if [ $? -eq 0 ]; then
	echo "rethink service framework already running ... "
else 
	echo "starting rethink service framework in a screen session ..." 
	screen -d -m -S framework /bin/sh -c "cd /opt/rethink/dev-service-framework && npm start"
	echo "DONE !"
fi

