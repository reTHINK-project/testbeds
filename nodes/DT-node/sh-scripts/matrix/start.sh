#!/bin/sh


echo "starting matrix container in a screen session ..." 
screen -d -m -S matrix /bin/sh -c "cd /opt/rethink/dev-msg-node-matrix && gulp dist && cd dist && nodejs NoMatrixMN "
echo "The Matrix container is now running detached in background ---> starting a console for monitoring purposes!"

