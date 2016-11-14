#!/bin/sh

cd ${0%/*}

./registry/stop.sh
./nomatrix/stop.sh
./proxy/stop.sh
./toolkit/stop.sh
./catalogue-broker/stop.sh
./catalogue-database/stop.sh

docker ps
