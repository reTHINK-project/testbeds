#!/bin/sh

cd ${0%/*}

./registry/stop.sh
./matrix/stop.sh
./proxy/stop.sh
./framework/stop.sh

docker ps
