docker inspect --format "{{.NetworkSettings.IPAddress}}" $1
docker inspect --format "{{.NetworkSettings.Networks.fullinstall_rethink.IPAddress}}" $1
