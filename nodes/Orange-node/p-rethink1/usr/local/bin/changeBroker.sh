docker stop catalogue-broker
docker rm catalogue-broker
docker run -it --net=host  -d --name="catalogue-broker"  rethink/catalogue-broker -host 161.106.2.23 -h 9011 -hs 9012 -default protocolstub/$1

