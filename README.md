CMU Heinz 95729 Course Project Team Dexter (2018)
=======================================

## Features
1. Stripe Integration
1. Shopping Cart
1. User Profile
1. Customer User Experience
1. Review System

## Getting Started

1. Make sure you have NodeJS installed
1. Make sure you have MongoDB installed and running
1. Install nodemon if you don't have it: `npm install -g nodemon`
1. Install bower if you don't have it: `npm install -g bower`
1. Install the API dependencies: `npm run install:api`
1. Install the web dependencies: `npm run install:web`
1. Install the CUI dependencies: `npm run install:cui`
1. Seed your database: `npm run seed`

### To start the web app:
In one terminal, start the API:

```Shell
$ npm run start:api
# OR
$ cd api
$ npm start
```

In another terminal, start the web app:
```Shell
$ npm run start:web
# OR
$ cd web
$ npm start
```

In another terminal, start the CUI app:
```Shell
$ npm run start:cui
# OR
$ cd cui
$ npm start
```