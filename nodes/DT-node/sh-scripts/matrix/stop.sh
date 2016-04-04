#!/bin/sh

echo "stopping Matrix Messaging node  ..."
sudo docker stop dev-msg-node-matrix
screen -X -S matrix quit
echo DONE!
