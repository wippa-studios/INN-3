 -v#!/bin/bash
set -e

SERVER="liveyourlife@cigritdev.fortiddns.com"
PORT=21022
DIR="liveyourlife.dockers"

echo "==> Building images..."
export DOCKER_BUILDKIT=0
docker build --no-cache -t lyl-backend:latest -f backend/LYL.Api/Dockerfile ./backend
docker build --no-cache \
  --build-arg VITE_API_BASE_URL=http://cigritdev.fortiddns.com:21002 \
  -t lyl-frontend:latest \
  ./frontend

echo "==> Packaging..."
docker save -o liveyourlife.tar lyl-backend:latest lyl-frontend:latest

echo "==> Transferring files to server..."
scp -P $PORT liveyourlife.tar $SERVER:$DIR/liveyourlife.tar
scp -P $PORT docker-compose.yml $SERVER:$DIR/docker-compose.yml
scp -P $PORT database/init.sql $SERVER:$DIR/database/init.sql

echo "==> Restarting on server..."
ssh -p $PORT $SERVER "
  docker ps -aq --filter label=com.docker.compose.project=liveyourlifedockers | xargs -r docker rm -f 2>/dev/null;
  docker rmi lyl-backend:latest lyl-frontend:latest 2>/dev/null;
  cd ~ && ./StartProjectwerk.sh load && cd liveyourlife.dockers && docker-compose up --no-build -d
"

echo "==> Done! Live at http://cigritdev.fortiddns.com:21001"
