docker pull rethink/registry-domain-server
docker pull rethink/catalogue-broker
docker pull rethink/catalogue-database
docker pull rethink/msg-node-vertx

cd ../dev-msg-node-nodejs
git pull

cd ../fullinstall
docker-compose down 
docker-compose up --build &

