#!/bin/bash
#
# Creates a docker image for Postgres, and runs it
# https://hub.docker.com/_/postgres

printf "\nrunning up...\n\n"
# assumes this script is in a directory named, "bin"
DIR=/Users/aaratrikachakraborty/Documents/Ecomm/heinz-95729-project-main/api
HOST_VOLUME_PATH=${DB_HOST_VOLUME_PATH:=$DIR/docker_volumes/postgresql/data}
CTNR_VOLUME_PATH=${DB_CTNR_VOLUME_PATH:=/var/lib/postgresql/data}

# stop on error (e) and print each command (x)
set -ex

mkdir -p $HOST_VOLUME_PATH

# NOTE: the variables in this script can be overridden
# by exporting the values in your terminal
# i.e. export DB_IMAGE_NAME=my_app_db

# Postgres variables
DB_USERNAME=${DB_USERNAME:=app_admin}
DB_PASSWORD=${DB_PASSWORD:=parsley-lumber-informal-Spectra-8}
DB_NAME=${DB_NAME:=heinz_95729_app}

# Docker image variables
DB_PORT=${DB_PORT:=5432}
DB_IMAGE_VERSION=${DB_IMAGE_VERSION:=11.8-alpine}
DB_IMAGE=${DB_IMAGE:=postgres:$DB_IMAGE_VERSION}
DB_IMAGE_NAME=${DB_IMAGE_NAME:=pgdb}
DB_IMAGE_PORT=${DB_IMAGE_PORT:=$DB_PORT:$DB_PORT}

# Run postgres in daemon mode, expose port 5432
# and mount this directory to /repo
printf "\nrunning $DB_IMAGE_NAME...\n\n"
docker run \
  --name $DB_IMAGE_NAME \
  --mount "type=bind,src=$DIR,dst=/repo" \
  -p $DB_IMAGE_PORT \
  -d \
  -e POSTGRES_USER=$DB_USERNAME \
  -e POSTGRES_PASSWORD=$DB_PASSWORD \
  -e POSTGRES_DB=$DB_NAME \
  -e TZ=GMT \
  -v $HOST_VOLUME_PATH:$CTNR_VOLUME_PATH \
  $DB_IMAGE
