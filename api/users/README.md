# Users

#### This section provides an example for documenting a data-type.

Legos `/example/legos` are ... They have the following schema:

Property | Type | Description
---- | ---- | -----------
_id | ObjectID | The unique identifier for the user
email | string | The email address of the user (must also be unique in the database)
name | string | The name of the user

> # Example User

```json
{
    "_id": "5623c1263b952eb796d79dfc",
    "email": "test@andrew.cmu.edu",
    "name": "Hello World"
}
```

## Register

This endpoint registers a new user `POST http://api.example.com/users`.

> # Example Request

```endpoint
{
    "method": "POST",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/users",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    }
}
```

> # Example Response `201`

```json
{
  "user": {
    "_id": "5623c1263b952eb796d79dfc",
    "email": "test@andrew.cmu.edu",
    "name": "Hello World"
  },
  "authToken": "abc123"
}
```

## Login

This endpoint signs a user in `POST http://api.example.com/users/login`.

> # Example Request

```endpoint
{
    "method": "POST",
    "protocol": "http",
    "host": "localhost:3000",
    "path": "/users/login",
    "headers": {
        "Accept": "application/json;version=20150828",
        "Cache-Control": "no-cache"
    }
}
```

> # Example Response `200`

```json
{
  "user": {
    "_id": "5623c1263b952eb796d79dfc",
    "email": "test@andrew.cmu.edu",
    "name": "Hello World"
  },
  "authToken": "abc123"
}
```
