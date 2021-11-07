# Users

Users have the following schema:

Property | Type   | Description
-------- | ------ | -----------
id       | UUID   | The unique identifier for the user
email    | string | The email address of the user (must also be unique in the database)
name     | string | The name of the user

Note this schema is not secured by a password. This example is not intended for production use, rather to lower the barrier to entry for exploring other aspects of the project.

NOTE: The book routes are defined in /src/api/compose-domains.js.

Several examples in this file use [httpie](https://httpie.io/).

## Example User

```json
{
    "id": "e43058dc-dd6b-4aa1-8d8b-b9a9a9992333",
    "email": "test@andrew.cmu.edu",
    "name": "Hello World"
}
```

## index.js

The index is the composition root for this domain. It is the only file that uses `require`. All of the modules in the src directory export a factory that accepts the dependencies they require to operate.

Some of the modules are composed by this package, while others are composed by the consumer of this package (/src/api in this project). This package attempts to compose everything it can on it's own so the consumer only need inject configurable dependencies, such as knex.

## testing

The test.js file exists to execute the tests when you navigate to this directory in your terminal. The test-plan.js is the composition root for test execution, and exists in a separate file so it can be aggregated with other test-plans in this mono-repo. The test-plan.js file is used by this test.js file, as well as by the test.js file in the root directory for this project.

## Register

To register a user, send a POST request to `http://localhost:3000/users` with a request body that includes the user's email, and name.

```
http POST http://localhost:3000/users \
  <<< '{ "email": "shopper5@95729.com", "name": "Shopper 5" }'
```

### Example Request

```json
{
    "method": "POST",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/users",
    "body": {
      "email": "shopper5@95729.com",
      "name": "Shopper 5"
    },
}
```

### Example Response `201`

```json
{
    "id": "e43058dc-dd6b-4aa1-8d8b-b9a9a9992333",
    "email": "test@andrew.cmu.edu",
    "name": "Hello World"
}
```

> NOTE the response includes a cookie that will keep the user signed in

## Login

To sign in user, send a POST request to `http://localhost:3000/users/login` with a request body that includes the user's email.

```
http POST http://localhost:3000/users/login \
  <<< '{ "email": "shopper5@95729.com" }'
```

### Example Request

```json
{
    "method": "POST",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/users/login",
    "body": {
      "email": "shopper5@95729.com",
    },
}
```

### Example Response `200`

```json
{
    "id": "e43058dc-dd6b-4aa1-8d8b-b9a9a9992333",
    "email": "test@andrew.cmu.edu",
    "name": "Hello World"
}
```

> NOTE the response includes a cookie that will keep the user signed in
