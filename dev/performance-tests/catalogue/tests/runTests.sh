#!/bin/sh

# url of catalogue;  assume catalogue is reachable by default ports for
#   http and https
CATALOGUE_URL=apple.de

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

# num_conn = number of connections (in parallel).
# in EACH connection, we have num_call number of calls at a rate of x_rate

URI=/

#Goal: determine the response rate of the server if we do NOT parallize
# requests.

autobench --single_host --host1 ${CATALOGUE_URL} --uri1 ${URI}      \
--low_rate 1 --high_rate 20 --rate_step 1 \
--num_call 10 --num_conn 200 \
--timeout 5 \
--output_fmt tsv --port1 80 \
--file results.tab



