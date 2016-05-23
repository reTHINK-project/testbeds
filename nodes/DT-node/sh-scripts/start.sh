#!/bin/sh

cd ${0%/*}

./prepare.sh

./registry/start.sh
./proxy/start.sh
#./framework/start.sh
./toolkit/start.sh
./matrix/start.sh

screen -ls
sleep 2
