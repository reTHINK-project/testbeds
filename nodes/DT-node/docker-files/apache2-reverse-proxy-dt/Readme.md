
If you choose not to expose this dockerfile via docker hub, you can build
the docker image locally via:

	cd <path_to_this_directory>
	docker build -t <reverse_proxy_image_name>  .

Note that you have to be in this directory to allow docker to
correctly copy the configuration files.  Choose an appropriate
image name (lower case only).  E.g., for the Fokus site, we
chose rev-proxy-fokus for <reverse_proxy_image_name>.

The created image containing your configuration can then be started
via:
	docker run -it --net=host  <reverse_proxy_image_name> 



