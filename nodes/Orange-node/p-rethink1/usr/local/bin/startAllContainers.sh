#!/bin/bash

docker start domainRegistry
docker start redis
docker start oidc-node
docker start demoService
docker start gReg
docker start msgnode
docker start catalogue-broker
docker start catalogue-database

# This is a patch. When the actual service will replace this one we can suppress this.
docker exec -it demoService service apache2 start
docker exec -it demoService service mysql start
docker exec -it gReg rm /var/run/gReg.pid
docker exec -it gReg service greg start

