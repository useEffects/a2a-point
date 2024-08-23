#!/bin/bash

# Function to check and stop all running containers
stop_containers() {
  containers=$(docker ps -q)
  if [ -n "$containers" ]; then
    docker stop $containers
  fi
}

# Function to remove all containers
remove_containers() {
  all_containers=$(docker ps -a -q)
  if [ -n "$all_containers" ]; then
    docker rm -f $all_containers
  fi
}

# Function to remove all volumes
remove_volumes() {
  volumes=$(docker volume ls -q)
  if [ -n "$volumes" ]; then
    docker volume rm $volumes
  fi
}

# Function to remove all networks excluding default networks
remove_networks() {
  networks=$(docker network ls | grep -v "bridge\|host\|none" | awk 'NR>1 {print $1}')
  if [ -n "$networks" ]; then
    docker network rm $networks
  fi
}

# Function to remove all images
remove_images() {
  images=$(docker images -q)
  if [ -n "$images" ]; then
    docker rmi -f $images
  fi
}

# Function to prune all unused Docker objects including volumes and builder cache
prune_docker() {
  docker system prune -a --volumes -f
  docker builder prune -a -f
}

# Function to remove Docker data directory and restart service
reset_docker() {
  sudo systemctl stop docker
  sudo rm -rf /var/lib/docker
  sudo systemctl start docker
  sudo systemctl restart docker
}

# Function to remove temporary Docker files
cleanup_temp_files() {
  sudo rm -rf /var/run/docker/*
  sudo rm -rf /etc/docker/*
}

# Stop all running containers
stop_containers

# Remove all containers
remove_containers

# Remove all volumes
remove_volumes

# Remove all networks excluding default networks
remove_networks

# Remove all images
remove_images

# Prune all unused Docker objects including volumes and builder cache
prune_docker

# Clean up temporary Docker files
cleanup_temp_files

# Reset Docker service and remove Docker data directory
reset_docker

echo "Powerful Docker cleanup complete."