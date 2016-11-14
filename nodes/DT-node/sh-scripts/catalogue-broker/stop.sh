#!/bin/sh

echo "stopping catalogue-broker  ..."
sudo docker stop catalogue-broker
screen -X -S catalogue-broker quit
echo DONE!
