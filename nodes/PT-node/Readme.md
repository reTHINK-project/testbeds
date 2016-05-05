# Altice Labs setup configuration

I don't use any shell script to setup the testbed;

**TODO**
  - Add the configuration and setup apache reverse proxy to a Dockerfile;


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

## Setup

With docker-compose, you only need to run one command to build/pull all services contained in the docker-compose.yml

```shell
# up -> build and start all the images;
# -d -> detach the command;
docker-compose up -d
```

```shell
# down -> stop and remove all containers;
docker-compose down
```
