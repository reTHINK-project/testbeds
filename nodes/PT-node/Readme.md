# Altice Labs setup configuration

**TODO**
- Add the configuration and setup apache reverse proxy to a Dockerfile;



**NOTE**

We have two folder on for **production** and other for **development**


the **development** folder contain all catalogue_objects

the **production** folder only contain the specific catalogue_objects for our testbed



## docker-compose

The Compose file provides a way to document and configure all of the application’s service dependencies (msg-node, domain-registry, catalogue componets, toolkit, etc)

All this services are compiled in one docker-compose.yml file;

If you need know more or how to install the docker-compose, please view [here](https://docs.docker.com/compose/overview/)

This yml file is split by services, for example:

```yml
version: '2'
services:
  'msg-node-vertx':
    build: './dev-msg-node-vertx'
    container_name: 'msg-node-vertx'
    networks:
      rethink:
        ipv4_address: 172.18.0.2
    expose:
      - '443'
      - '9090'
```

## Startup

Connect to the server with the ssh client
```shell
ssh ptin_admin@192.168.89.95
```

### docker commands

More information about the docker commands [here](https://docs.docker.com/engine/reference/commandline/);
This commands need the sudo authorization like this `sudo docker-compose up -d`;

Now we can support the localhost domain on our testbed:

```shell
# start all services on docker-compose.yml without the localhost support
docker-compose up -d

# start all services on docker-compose.yml and start also the localhost support
# this will start the msg-node-vertx and domain-registry with the localhost domain configured
docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d
# now in your protocolstub configuration url you can include
# wss://msg-node.<domain>/localhost/ws
```

```shell

# list all images created by docker
docker images

# remove a specific images
# -f force
docker rmi <ID>

# list all containers running;
docker ps

# remove a specific container
docker rm <ID>
```


### Docker-compose commands

With docker-compose, you only need to run one command to build/pull all services contained in the docker-compose.yml

The following commands are the basic, you can see a full list of commands [here](https://docs.docker.com/compose/reference/overview/).

```shell
# update all the remote services inside the docker-compose.
# only update the services with service image defined and hosted on docker-hub;
docker-compose pull
```

##### Start containers
```shell
# up -> build and start all the images;
# -d -> detach the command;
docker-compose up -d

# up a specif service
docker-compose up -d <service-name>
```

##### Restart containers
```shell
# restart all containers
docker-compose restart

# restart one container
docker-compose restart <service-name>

# restart multiple containers
docker-compose restart <service-name> <service-name>
```

##### Stop containers
```shell
# down -> stop and remove all containers;
docker-compose down

# stop
# service-name is defined on docker-compose
# example: https://github.com/reTHINK-project/testbeds/blob/master/nodes/PT-node/docker-compose.yml#L3
docker-compose stop <service-name>

# this command will remove all stoped containers
docker rm
```

##### Logs

List all logs from all containers is **not recommended**

```shell
# not recommended
docker-compose logs

# list all logs of specific container
docker-compose logs <service-name>

# list and follow the recent logs from a specific container
# without the service-name, list all the logs (not recommended)
docker-compose logs -f <service-name>

# list and follow the last 20 lines of the logs
# without the service-name, list all the logs of all services;
# this is the best way to see the logs with or without the service-name
docker-compose logs -f --tail=20 <service-name>
```
