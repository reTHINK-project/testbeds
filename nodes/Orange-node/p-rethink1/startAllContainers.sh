#!/bin/bash

# Start docker containers installed in the pf
# Example:
#docker start CONTAINER_NAME
docker start domainRegistry
docker start devidpserver_redis_1
docker start devidpserver_oidc-node_1
docker start demoService
docker start gReg
docker start msgNode


# Example of command line that can be run after the container is launched
#docker exec -it CONTAINER_NAME service SERVICE_NAME start
docker exec -it demoService service apache2 start
docker exec -it demoService service mysql start

