#!/bin/sh

docker update `docker images | tail -n +2 | awk '{print $3}' `

