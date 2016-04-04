#!/bin/sh

echo "checking docker network bridge for rethink..."
docker network ls | grep rethink
if [ $? -eq 0 ]; then
	echo docker network 'rethink' already exists!
else
	echo docker network 'rethink' does not exist --> creating it ...
	docker network create rethink
	echo ... DONE!
fi

echo "checking existence of the \"screen\" tool ..."
which screen
if [ $? -eq 0 ]; then 
	echo "\"screen\" is already installed"
else
	echo "installing \"screen\" tool" ...
	apt install -y screen 
	echo DONE!
fi
