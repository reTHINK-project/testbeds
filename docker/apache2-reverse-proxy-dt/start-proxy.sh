#!/bin/sh

docker rm proxy; sudo docker run -it --net=rethink --name=proxy -p 443:443 -v keys:/opt/certs apache2-reverse-proxy-dt
#docker rm proxy; sudo docker run -it --net=rethink --name=proxy -p 443:443 -v /opt/rethink/testbeds/docker/apache2-reverse-proxy-dt/keys:/opt/certs apache2-reverse-proxy-dt
