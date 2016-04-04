#!/bin/sh

cd ${0%/*}

./prepare.sh

./registry/start.sh
./matrix/start.sh
./proxy/start.sh
./framework/start.sh

screen -ls
sleep 2
