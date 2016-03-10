#!/bin/bash

#Configuration section
IF=eth0                         #Update OSA with IP of this interface
OSA_URL=https://localhost:6443  #OSA Admin service base URI
OSA_USER=container                    #OSA Admin user
OSA_PASS=ContainerP4ss

#Get IP for specified interface
#MY_IP=`ifconfig $IF| grep inet | grep -v inet6|awk '{print $2}'|awk -F ":" '{print $2}'`
#Build backend URL with required IP

#End of configuration section

# 3 parameters
# docker container name
# OSA service name
# backed port and URL (:XX/
function updateOSA(){
	CONTAINER_NAME=$1
	SERVICE=$2                    #OSA Service to update
	MY_IP=`docker inspect --format "{{.NetworkSettings.IPAddress}}" $CONTAINER_NAME`
	BACKEND_URL="http%3A%2F%2F$MY_IP$3"


	#Update OSA
	curl -s -i "$OSA_URL/services/$SERVICE" -k -u "$OSA_USER:$OSA_PASS" -X PUT -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' -H 'Accept: application/json' --data "backEndEndPoint=$BACKEND_URL" >$$.tmp
	grep "HTTP/1.1 200" $$.tmp>/dev/null
	if [ $? -ne 0 ] ; then
	    cat $$.tmp
	    rm $$.tmp
	    return  1
	else
	    echo "OSA update successfull";
	    rm $$.tmp
	    return 0
	fi
}


updateOSA demoService Service1 %2Fdemo%2F
updateOSA devidpserver_oidc-node_1 IdP %3A8080%2F
updateOSA domainRegistry domainregistry %3A4567%2F
updateOSA gReg GlobalRegistry %3A5002%2F
updateOSA msgNode msgnode %3A9090%2F 
