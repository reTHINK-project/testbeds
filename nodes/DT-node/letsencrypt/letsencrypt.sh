#!/bin/bash

THISDOMAIN=rethink.tlabscloud.com

cd /letsencrypt/

if [ $1 == "create" ]; then
	echo "Creating new Certificate for domain $THISDOMAIN";
	./letsencrypt-auto certonly --standalone -d $THISDOMAIN
else	
	echo "Renewing Certificate for $THISDOMAIN";
	./letsencrypt-auto renew -nvv --standalone > /var/log/letsencrypt/renew.log 2>&1
fi
