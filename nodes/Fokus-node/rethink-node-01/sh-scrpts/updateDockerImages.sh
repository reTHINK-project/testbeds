#!/bin/sh

(cd `dirname $0`/../../../../docker/apache2-reverse-proxy-fokus; docker build -t fokus-rproxy .)

docker pull rethink/catalogue-broker
docker pull rethink/catalogue-database
docker pull rethink/catalogue-test-client



