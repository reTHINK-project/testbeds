#!/bin/sh

docker rm proxy; sudo docker run -it --net=rethink --name=proxy -p 443:443 apache2-reverse-proxy-dt
