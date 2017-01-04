#!/bin/sh
cd ${0%/*}
DIR=`pwd`
echo $DIR
docker rm dt-toolkit
docker run -it --name dt-toolkit --net=rethink -v /home/steffen/work/git/rethink/hyperty:/dt-toolkit dt-toolkit /bin/bash
