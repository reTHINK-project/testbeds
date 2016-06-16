#!/bin/sh

# number of repetitions per experiment

replicas=200
replicas=8

# url of catalogue;  assume catalogue is reachable by default ports for
#   http and https
#CATALOGUE_URL=catalogue-rethink.fokus.fraunhofer.de
#PORT=80
CATALOGUE_URL=rethink-node-01.fokus.fraunhofer.de
PORT=9011

# Tools build directory
TOOLS_BD=../tools/build

# loction of executables within TOOLS_BD
AUTOBENCH_DIR=${TOOLS_BD}/Autobench-master
HTTPERF_DIR=${TOOLS_BD}/httperf-master/build/src

# add dirs with executalbes to path
PATH=${PATH}:${AUTOBENCH_DIR}:${HTTPERF_DIR}


# set limit for open files
ulimit -n 2048


# now run the actual tests

# num_conn = number of connections.
# in EACH connection, we have num_call number of calls at a rate of x_rate

URI=/.well-known/hyperty/HelloWorldReporter

# Notes on hhtperf:
#   --num_conn should be >= 2 in order to correctly calculate the connection rate
#
# Reported reply rate seems to be boguous.  Rather check on the errors to verify
#   for error=0 that all replys were received.

#Goal: determine the response rate of the server if we do NOT parallize
# requests.

# Experiment 1:  Goal:  determine the response time.  We contineously increase
# the connection rate to reduce the time between two consequitive requests.
# Requests are not back to back for low rates as we only have one call per
# connection.

if [ 1 -eq 0 ];  # set one value to 0 to skip this experiment, to 1 to run it
then
  i=1;
  while [ $i -le $replicas ]; do
    echo =======================================
    echo Experiment 1:  RUNNING Replica $i of $replicas
    echo =======================================

    autobench --single_host --host1 ${CATALOGUE_URL} --uri1 ${URI}      \
      --low_rate 1 --high_rate 4000 --rate_step 5 \
      --num_call 1 --num_conn 20 \
      --timeout 5 \
      --output_fmt tsv --port1 $PORT \
      --file response_time_numcalls_1_$i.tab 2>&1 | tee response_time_numcalls_1_$i.outputLog

    i=`expr $i + 1`
  done
fi


if [ 1 -eq 1 ];  # set one value to 0 to skip this experiment, to 1 to run it
then
i=6;
while [ $i -le $replicas ]; do
echo =======================================
echo Experiment 2: RUNNING Replica $i of $replicas
echo =======================================

autobench --single_host --host1 ${CATALOGUE_URL} --uri1 ${URI}      \
--low_rate 1 --high_rate 400 --rate_step 1 \
--num_call 10 --num_conn 20 \
--timeout 5 \
--output_fmt tsv --port1 $PORT \
--file response_time_numcalls_10_$i.tab 2>&1 | tee response_time_numcalls_10_$i.outputLog

# allow system under test to settle down again in case we've driven it in
# overload situations
sleep 10;
i=`expr $i + 1`
done
fi






exit 0;

autobench --single_host --host1 ${CATALOGUE_URL} --uri1 ${URI}      \
--low_rate 400 --high_rate 500 --rate_step 100 \
--num_call 10 --num_conn 25 \
--timeout 5 \
--output_fmt tsv --port1 $PORT \
--file results.tab


