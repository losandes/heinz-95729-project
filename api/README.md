# Heinz-95729 Project API

This is a sample API to support an ecommerce experience. The API includes the following domains:

-   [users](src/lib/users)
-   [products](src/lib/products)
-   [books](src/lib/books)

These domains are composed into a koa app (API only) in the [src/api](src/api) directory.

## Getting Started

This project uses Architecture Decision Records (ADRs). In addition to the documentation in this file, you should [read the ADRs](adr). They include information on project organization (file and folder naming, design conventions, app composition), library decision context, etc. As you contribute to this project, please make sure to include ADRs for any significant decisions that you make.

These instructions assume you are using a bash compatible shell (i.e. https://ohmyz.sh/) and that you navigated to the directory this README is in in your terminal (i.e. `cd ~/.../heinz-95729-project/api`).

### ENVVARS

See _.env-example_ for a list of ENVVARS. You can set these either by adding a _.env_ file to the root folder of this project, or using `export ENVVAR_NAME=value` in your terminal.

### Install the dependencies

#### Docker

Most of the dependencies can be installed via the command line. _Docker_ is not one of them. Before installing docker, make sure you don't have a conflict:

```Shell
which docker
```

1. If that printed "/usr/local/bin/docker" you're all set :+1:
1. If that printed something else, you might need to get rid of what you have. For instance, if it points to a global npm package (i.e. in your nvm directory), remove it.
1. When you're confident there is no conflict, install [Docker for Mac](https://www.docker.com/docker-mac), or [Docker for Windows](https://www.docker.com/docker-windows)
1. Install [Kitematic](https://kitematic.com)
1. Start both Docker and Kitematic

> NOTE: regardless of which operating system you use, these instructions
> assume you're using a shell derived from bash, such as https://ohmyz.sh/.

#### Provisioning a Postgres Database

This app uses [PostgreSQL](https://www.postgresql.org/) for the database. You can install it directly on your computer if you like. I prefer to install it in a docker container because it's easier to destroy and rebuild it. You'll need a database IDE as well. There are lots of good options out there. I often use [TablePlus](https://www.tableplus.io/download).

##### Installing Postgres with bash

Following is a bash script that you can execute to start a new postgres container.

```Shell
#!/bin/bash
#
# Creates a docker image for Postgres, and runs it
# https://hub.docker.com/_/postgres

printf "\nrunning up...\n\n"
# assumes this script is in a directory named, "bin"
DIR=/Users/[the path to where you cloned this repo...]/heinz-95729-project/api
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
DB_NAME=${DB_NAME:=app}

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
```

Here are some other scripts you can use to interact with the docker image:

```Shell
# destroy the image:
docker rm -fv ${DB_IMAGE_NAME:=pgdb}
rm -rf $HOST_VOLUME_PATH

# start the image
docker container start ${DB_IMAGE_NAME:=pgdb}

# stop the image
docker container stop ${DB_IMAGE_NAME:=pgdb}

# connect to the shell of the docker image
# | switch | description                                      |
# |--------|--------------------------------------------------|
# | -i     | Keep STDIN open even if not attached             |
# | -t     | Allocate a pseudo-TTY                            |
docker exec -it ${DB_IMAGE_NAME:=pgdb} /bin/bash

# connect to the postgres repl on the docker image
# | switch | description                                      |
# |--------|--------------------------------------------------|
# | -i     | Keep STDIN open even if not attached             |
# | -t     | Allocate a pseudo-TTY                            |
docker exec -it $DB_IMAGE_NAME \
  sh -c 'exec psql --username=$POSTGRES_USER --dbname=$POSTGRES_DB'
```

##### Installing Postgres with Docker and Kitematic

1. Install [Docker for Mac](https://www.docker.com/docker-mac), or [Docker for Windows](https://www.docker.com/docker-windows)
2. Install [Kitematic](https://kitematic.com)
3. Start both Docker and Kitematic
4. In Kitematic, click "+ New", and search for for the "official postgres" package

<img width="846" alt="postgres-container" src="https://user-images.githubusercontent.com/933621/140774217-e9e302dc-eb35-4e2c-8ac1-a8db1f902b20.png">

5. Click "CREATE" to create an instance
6. Select the "postgres" instance from the left navigation

<img width="1075" alt="select-image" src="https://user-images.githubusercontent.com/933621/140775164-5473433f-3d72-43dc-b275-486072f9e95c.png">

7. Click "Settings" and in the "General" tab, set Environment Variables for:
   -   POSTGRES_DB=heinz_95729_app
   -   POSTGRES_USER=app_admin
   -   POSTGRES_PASSWORD=parsley-lumber-informal-Spectra-8
   -   TZ=GMT


<img width="1084" alt="set-envvars" src="https://user-images.githubusercontent.com/933621/140776846-6813bd41-8310-406f-9fa5-3b6a3efac10a.png">

8. In the "Hostname / Ports" tab, set the "Published IP:Port" to 5432.

<img width="1086" alt="set-port" src="https://user-images.githubusercontent.com/933621/140777087-4af6d0a9-ac7a-45ba-9a2e-cd5654b64348.png">

9. Start the container

#### Install NVM

##### With HomeBrew

```Shell
# these instructions use HomeBrew: https://brew.sh/
brew update

# install NodeJS Version Manager if you don't already have it
brew install nvm
source $(brew --prefix nvm)/nvm.sh
# install node LTE 16.3.0
nvm install 16.3.0
# Use it
nvm use 16.3.0
# And set it as your default (optional)
nvm alias default 16.3.0

# cleanup cached brew files
brew cleanup -s
rm -rf "$(brew --cache)"
```

##### Without HomeBrew

[Install NVM](https://github.com/nvm-sh/nvm#installing-and-updating). Then in a bash derived shell, use NVM to install a version of NodeJS, and then install pnpm.

```Shell
# install node LTE 16.3.0
nvm install 16.3.0
# Use it
nvm use 16.3.0
# And set it as your default (optional)
nvm alias default 16.3.0
```

#### The rest

```Shell
# Install pnpm (pnpm is more reliable, efficient, and secure than npm)
npm install -g pnpm

# Install the app's dependencies
pnpm install --recursive

# migrate the tables
pnpm run migrate:up

# Start the app in _watch_ mode
pnpm run watch

# Add a product
http POST http://localhost:3000/books <<< '{ "title": "This Is Where I Leave You: A Novel", "uid": "where_i_leave_you", "description": "The death of Judd Foxman'"'"'s father marks the first time that the entire Foxman clan has congregated in years. There is, however, one conspicuous absence: Judd'"'"'s wife, Jen, whose affair with his radio- shock-jock boss has recently become painfully public. Simultaneously mourning the demise of his father and his marriage, Judd joins his dysfunctional family as they reluctantly sit shiva-and spend seven days and nights under the same roof. The week quickly spins out of control as longstanding grudges resurface, secrets are revealed and old passions are reawakened. Then Jen delivers the clincher: she'"'"'s pregnant.", "metadata": { "authors": [{ "name": "Jonathan Tropper" }], "keywords": ["funeral", "death", "comedy"] }, "price": 7.99, "thumbnailHref": "https://m.media-amazon.com/images/I/81hvdUSsatL._AC_UY436_QL65_.jpg", "type": "book" }'

# Get a book
# Replace the `:uid` with the uid of the product you created
http http://localhost:3000/books/:uid

# Find a book
# Replace the `:uid` with the uid of the product you created
http http://localhost:3000/books?q=tropper
```

> NOTICE all the commands are using `pnpm`, not `npm`. See [adr/20210207-choose-package-manager.md](adr/20210207-choose-package-manager.md) for more information.

## Running Tests

```Shell
# run the tests locally
pnpm test -- -r nyan

# alt example (skip the pnpm run syntax)
node test -r nyan

# alt example (Saving Markdown test output is great for sharing with analysts, QA, client, etc.)
node test -r md > markdown-to-share-with-client.md

# alt example (TAP, and summary are great for CI)
node test -m ONLY -r tap,summary

# alt example (Want deterministic ordering? Want to pipe into other commands / 3rd party reporters?)
node test -m ONLY -r tap,summary -o deterministic | npx tap-parser -j | jq

# alt example (JSON)
node test -r json | jq
```

> See [supposed docs](https://github.com/losandes/supposed#arguments-and-envvars) for more information on the args, and reporters that are supported.
>
> NOTE that if/as you change dependencies, you need to `pnpm install --recursive`, or install the dependencies in the package that you changed dependencies in.

## Adding Domains, Routes, & Migrations

In this API, domains are created as their own packages to promote decoupling, and re-use. The domains can be found in _src/lib_. Each domain should have it's own package.json, migrations, and test files. When adding a new domain:

1. Create your package in _src/lib_, and make sure to give it a unique name in the package.json
1. Create, or copy/paste-and-edit the base files and folders from another domain: index.js, knexfile and migrate.js (if there are migrations), test.js, test-plan.js, src/, migrations/.
1. In your terminal, navigate to _src/api_
1. Install the domain (i.e. `pnpm add ../lib/new-domain`)
1. Require the package and initialize it in _src/api/compose-domains.js_ (Poor Man's DI). Note this is where you will register routes and database schema migrations, as well.
1. If the domain includes features that should be added to the health check, add a test to _src/api/compose-test.js_

> See the _src/lib/products_, and _src/lib/books_ domains for examples that include migrations, routes, and that are tested on startup, and by the healthcheck

## Local Database Development

This app uses [knex](https://knexjs.org) for database development and connections. Migrations run automatically when the app starts. You can also execute them manually without starting the app.

```Shell
# set your ENVVARS
export NODE_ENV=local
export DB_CONNECTION_STRING=postgresql://app_admin:parsley-lumber-informal-Spectra-8@0.0.0.0:5432/heinz_95729_app?sslmode=disable

# run any migrations that haven't been commited yet
pnpm run migrate:up

# destroy all migrations (teardown)
pnpm run migrate:down
```

You have more control when not running the migrations in aggregate. Following is an example for using the [knex Migrations CLI](https://knexjs.org/#Migrations-CLI) with a specific domain.

```Shell
# set your ENVVARS
export NODE_ENV=local
export DB_CONNECTION_STRING=postgresql://app_admin:parsley-lumber-informal-Spectra-8@0.0.0.0:5432/heinz_95729_app?sslmode=disable

# navigate to the domain
cd src/lib/users

# make sure the dependencies are installed
pnpm install

# run the next migration
npx knex migrate:up

# rollback the last migration
npx knex migrate:down

# create a new migration file
npx knex migrate:make add_table
```

### Migration file naming conventions

As with ADRs and commit messages, and to help with readability, the name should be a _present tense imperative verb phrase_. To balance readability, and system usability, names should be lower-snake-case (lowercase with underscores). i.e.:

* add_users_table
* alter_users_table_add_foo_column
* alter_users_table_drop_foo_column
* add_indexes_to_users_table
