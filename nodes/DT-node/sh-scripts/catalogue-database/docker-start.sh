
docker rm catalogue-database
	#-v /opt/rethink/testbeds/nodes/PT-node/development/catalogue-database/catalogue_objects:/catalogue-database rethink/catalogue-database \
docker run -it --net=rethink --name="catalogue-database" -p 9091:80 \
	-v /opt/rethink/dev-catalogue/docker/catalogue-database-reTHINKdefault/catalogue_objects:/catalogue-database rethink/catalogue-database \
        -domain catalogue.rethink.tlabscloud.com \
        -o /catalogue-database \
        -ch catalogue-database \
        -h catalogue-broker/5683

