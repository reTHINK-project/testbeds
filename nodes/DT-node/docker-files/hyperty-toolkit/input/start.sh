#!/bin/bash
export HYPERTY_REPO=hyperty
cd /hyperty-toolkit
if [ ! -d ./node_modules ]; then 
	echo install and start
	npm install && npm start; 
else 
	echo just start
	npm start; 
fi || /bin/bash

