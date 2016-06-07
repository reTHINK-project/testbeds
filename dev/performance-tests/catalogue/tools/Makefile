#!/bin/sh

all: getSrc compile

getSrc:
	#
	# get src code from github
	#
	mkdir build
	cd build && wget https://github.com/menavaur/Autobench/archive/master.zip && unzip master.zip && rm master.zip

	cd build && wget https://github.com/httperf/httperf/archive/master.zip && unzip master.zip && rm master.zip

compile:
	#
	# building the stuff
	#

	cd build/Autobench-master && make
	cd build/httperf-master && autoreconf -i && mkdir build && cd build && ../configure && make

clean:
	rm -rf build

