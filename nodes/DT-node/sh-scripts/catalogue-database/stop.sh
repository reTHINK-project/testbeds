#!/bin/sh

echo "stopping catalogue-database  ..."
sudo docker stop catalogue-database
screen -X -S catalogue-database quit
echo DONE!
