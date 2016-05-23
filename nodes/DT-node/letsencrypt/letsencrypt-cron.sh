#!/bin/bash

echo "Stopping Proxy Docker Container"
/opt/rethink/testbeds/nodes/DT-node/sh-scripts/proxy/stop.sh

echo "Starting letsencrypt-auto for domain"
sudo /opt/letsencrypt/letsencrypt-auto renew -nvv --standalone 

sudo p /etc/letsencrypt/live/rethink.tlabscloud.com/cert.pem /opt/rethink/testbeds/docker/apache2-reverse-proxy-dt/keys/server.crt
sudo cp /etc/letsencrypt/live/rethink.tlabscloud.com/privkey.pem /opt/rethink/testbeds/docker/apache2-reverse-proxy-dt/keys/server.key

echo "Re-Starting Proxy Docker Container"
/opt/rethink/testbeds/nodes/DT-node/sh-scripts/proxy/start.sh

