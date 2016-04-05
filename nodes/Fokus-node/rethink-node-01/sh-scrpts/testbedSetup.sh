#!/bin/sh

case $1 in
	start)

		# note: we remove existing containers to (a) reuse the name-tags and (b) assure that we starte in a clean state
		echo
		echo ------------------------------------------------------------------------
		echo removing ALL docker containers
		echo ------------------------------------------------------------------------
		echo
		sleep 1
		`dirname $0`/../../../../docker/sh-scrpts/rmAllDockerContainers.sh 
		sleep 3

		echo
		echo ------------------------------------------------------------------------
		echo updating all docker images:
		echo ------------------------------------------------------------------------
		echo
		sleep 1
		`dirname $0`/updateDockerImages.sh
		sleep 3

		echo
		echo ------------------------------------------------------------------------
		echo starting reverse proxy docker image as a DETACHED docker process
		echo ------------------------------------------------------------------------
		echo
		sleep 1
		docker run -it -d --net=host --name rethink-rproxy fokus-rproxy
		sleep 3

		echo
		echo ------------------------------------------------------------------------
		echo starting catalogue brocker docker image as a DETACHED docker process
		echo ------------------------------------------------------------------------
		echo
		sleep 1
		docker run -it -d --net=host --name rethink-c-broker rethink/catalogue-broker -h 9011 -s 9012
		sleep 3

		echo
		echo ------------------------------------------------------------------------
		echo starting catalogue database docker image as a DETACHED docker process
		echo ------------------------------------------------------------------------
		echo
		sleep 1
		docker run -it -d --net=host --name rethink-c-database rethink/catalogue-database
		sleep 3

		echo
		echo ------------------------------------------------------------------------
		echo starting catalogue testpage docker image as a DETACHED docker process
		echo ------------------------------------------------------------------------
		echo
		sleep 1
		docker run -it -d --net=host --name rethink-c-testclient rethink/catalogue-test-client 9041
		sleep 3
	;;
	stop)
		echo
		echo ------------------------------------------------------------------------
		echo stopping all running docker processes
		echo ------------------------------------------------------------------------
		echo
		sleep 1
		docker stop `docker ps | cut -d " " -f1 | tail -n +2`
		sleep 3

	;;
	*)
		echo $0 start
		echo $0 stop
	;;
esac

