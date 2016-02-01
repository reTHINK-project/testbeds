#!/bin/sh

for i in `docker images | tail -n +2 | awk '{print $1}' `
do
	docker pull -a $i
done



