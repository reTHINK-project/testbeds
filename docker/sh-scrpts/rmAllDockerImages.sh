#!/bin/sh

docker rmi `docker images | tail -n +2 | awk '{print $3}' `

