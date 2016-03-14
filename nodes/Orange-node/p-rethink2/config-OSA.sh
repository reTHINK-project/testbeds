#!/bin/bash

#Dynamic configuration of the OSA WebService Gateway (https://github.com/zorglub42/OSA/) used as a reverse proxy
#Configuration section
IF=eth0                         #Update OSA with IP of this interface
OSA_URL=https://localhost:6443  #OSA Admin service base URI
#OSA Admin user (has to be configured in the reverse proxu)
OSA_USER=<user_name>                    
OSA_PASS=<user_pass>

#Get IP for specified interface
#MY_IP=`ifconfig $IF| grep inet | grep -v inet6|awk '{print $2}'|awk -F ":" '{print $2}'`
#Build backend URL with required IP

#End of configuration section

# 3 parameters
# docker container name
# OSA service name
# backed port and URL (:XX/YYY)
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


#Here we call the services configured as in this example 
#for : use %3A for / use %2F, the IP is retreived from the container name. 
#for http://172.17.0.3:8080/toto enter only %3A8080%2Ftoto as URL_END parameter
#updateOSA CONTAINER_NAME OSA_SERVICE_NAME URL_END 
updateOSA BrokerService broker %3A8080%2F
updateOSA BrokerServiceAdmin broker %3A8080%2Fdashboard.html
