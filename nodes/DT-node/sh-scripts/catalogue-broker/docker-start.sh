
docker rm catalogue-broker
docker run -it --net=rethink --name="catalogue-broker" -p 9090:80 rethink/catalogue-broker \
        -host catalogue-broker \
        -sourcePackageURLHost catalogue.rethink.tlabscloud.com \
        -ch catalogue-broker 

