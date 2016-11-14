#!/bin/sh


echo "starting catalogue-database container in a screen session ..." 
screen -d -m -S catalogue-database /bin/sh -c "/opt/rethink/testbeds/nodes/DT-node/sh-scripts/catalogue-database/docker-start.sh"
echo "The catalogue-database container is now running detached in background"

