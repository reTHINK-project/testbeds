#!/bin/sh
# returns IP address of a given container
# Used to dynamically configure the reverse proxy
docker inspect --format "{{.NetworkSettings.IPAddress}}" $1
