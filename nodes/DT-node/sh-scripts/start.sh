#!/bin/sh

cd ${0%/*}

./prepare.sh

./registry/start.sh
./proxy/start.sh
./toolkit/start.sh
./nomatrix/start.sh
./catalogue-broker/start.sh
./catalogue-database/start.sh

screen -ls
sleep 2
