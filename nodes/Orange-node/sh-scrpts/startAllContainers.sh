#!/bin/bash

docker start domainRegistry
docker start devidpserver_redis_1
docker start devidpserver_oidc-node_1
docker start demoService
docker start gReg
docker start msgNode

# This is a patch. When the actual service will replace this one we can suppress this.
docker exec -it demoService service apache2 start
docker exec -it demoService service mysql start

