#!/bin/sh
docker rm toolkit
docker run -it --name toolkit --net=rethink -p 8080:8080 -p 3001:3001 -v /opt/rethink/dev-hyperty-toolkit:/hyperty-toolkit -v /opt/rethink/dev-hyperty:/hyperty hyperty-toolkit
