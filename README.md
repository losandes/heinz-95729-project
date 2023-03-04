# CMU Heinz 95729 Course Project

This repository provides a foundation for Heinz 95729 E-Commerce Tech course projects that include APIs, and/or web apps.

The primary technologies include:

- [Koa](https://koajs.com/) to run the server
- [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) to add GraphQL support to koa
- [VueJS](https://vuejs.org/) for the client (frontend web app)
- [Vite](https://vitejs.dev/) for client (frontend) tooling
- [Vitest](https://vitest.dev/) for client (frontend) testing
- [Supposed](https://github.com/losandes/supposed) for server (backend) testing
- [Tailwindscss](https://tailwindcss.com/) for styling
- [SQLite](https://www.sqlite.org/index.html) for a quick start for relational data (you can swap this out with a database of your choice)

## Directory Structure

```
root
├── client: the svelte web app
│   ├── src: the svelte code
│   └── static: static HTTP resources
├── lib: the domains that the graph-api consumes
└── server: the server code
    ├── data_volumes: gitignored folder where the API data is cached
    └── src: the koa+yoga api code
        └── schema: the GraphQL schema (typedefs and resolvers)
```

## Getting Started

### ENVVARS

See _.env-example_ for a list of ENVVARS. You can set these either by adding a _.env_ file to the root folder of this project, or using `export ENVVAR_NAME=value`.

### Data Caching

This app caches data it pulls from Forecast and BambooHR in files for now. They are stored in the gitignored _data_ directory, which you need to create for the app to run.

### Install the dependencies

These commands assume your terminal is in the same directory as this README and that you already have homebrew installed.

```Shell
# Create the gitignored data directory and a db file
mkdir server/data_volumes
touch server/data_volumes/heinz-95729.db

# Create the .env files, then check them out and
# make sure you agree with the settings
cp server/.env.example server/.env
cp client/.env.example client/.env

# Update homebrew
brew update

# install Node Version Manager if you don't already have it
brew install nvm
source $(brew --prefix nvm)/nvm.sh

# cleanup cached brew files
brew cleanup -s
rm -rf "$(brew --cache)"

# install node LTE 18.14.1
nvm install 18.14.1

# Use it
nvm use 18.14.1

# And set it as your default (optional)
nvm alias default 18.14.1

# Install pnpm (this is necessary as long as this is a mono-repo)
npm install -g pnpm

# Install the app's dependencies
pnpm install --recursive

# Start the app in _watch_ mode
pnpm run dev
```

> NOTICE all the commands are using `pnpm`, not `npm`. See [adr/20200416-choose-package-manager.md](adr/20200416-choose-package-manager.md) for more information.

Once the app is running, you can check it out at:

- [Web home page](http://localhost:3000)
- [Sign in (instructions are on the logn page)](http://localhost:3000/auth/login)
- [GraphiQL via the proxy](http://localhost:3000/api/graphql)
- Or you can also get to [GraphiQL directly on the server](http://localhost:3001/graphql)

_Note the '/api' path when you navigate the GraphiQL via the web app. Vite is proxying the server, so all requests to the web app that have '/api' after the origin will be routed to the server_.
