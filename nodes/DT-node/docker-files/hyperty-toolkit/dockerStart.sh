#!/bin/sh
cd ${0%/*}
DIR=`pwd`
echo $DIR
docker rm toolkit
docker run -it --name toolkit --net=rethink -p 8080:8080 -p 3001:3001 -v /home/steffen/work/git/rethink/dev-hyperty-toolkit:/hyperty-toolkit hyperty-toolkit /bin/bash
