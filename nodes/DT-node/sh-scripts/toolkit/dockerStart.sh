#!/bin/sh
docker rm toolkit
docker run --name toolkit --net=rethink -p 8080:8080 -p 3001:3001 hyperty-toolkit /start.sh
