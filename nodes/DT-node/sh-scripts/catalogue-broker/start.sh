#!/bin/sh


echo "starting catalogue-broker container in a screen session ..." 
screen -d -m -S catalogue-broker /bin/sh -c "/opt/rethink/testbeds/nodes/DT-node/sh-scripts/catalogue-broker/docker-start.sh"
echo "The catalogue-broker container is now running detached in background"

