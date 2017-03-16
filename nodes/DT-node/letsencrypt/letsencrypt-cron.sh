#!/bin/bash

echo "Stopping Proxy Docker Container"
docker-compose -f /opt/rethink/testbeds/nodes/DT-node/docker-compose/stable/docker-compose.yaml stop proxy

echo "Starting letsencrypt-auto for domain"
sudo /opt/letsencrypt/letsencrypt-auto renew -nvv --standalone 

sudo p /etc/letsencrypt/live/rethink.tlabscloud.com/cert.pem /opt/rethink/testbeds/docker/apache2-reverse-proxy-dt/keys/stable/server-stable.crt
sudo cp /etc/letsencrypt/live/rethink.tlabscloud.com/privkey.pem /opt/rethink/testbeds/docker/apache2-reverse-proxy-dt/keys/server-stable.key
sudo cp /etc/letsencrypt/live/rethink.tlabscloud.com/chain.pem /opt/rethink/testbeds/docker/apache2-reverse-proxy-dt/keys/chain.pem

echo "Re-Starting Proxy Docker Container"
docker-compose -f /opt/rethink/testbeds/nodes/DT-node/docker-compose/stable/docker-compose.yaml start proxy

