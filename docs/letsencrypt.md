### Quick guide of ssl key generation with letsencrypt

All is in detail in https://letsencrypt.org/ but this pages only gives stupid process, on a virgin ubuntu platform.
Ensure that you have stopped any Web Server that could conflict with the letsencrypt process (for example by stopping your reverse proxy).

`git clone https://github.com/letsencrypt/letsencrypt`  
`cd letsencrypt/`  
`./letsencrypt-auto --help`  
`./letsencrypt-auto certonly --standalone -d <domain-name>`  
   

The certificates are in the directory /etc/letsencrypt/live/domain-name



 
