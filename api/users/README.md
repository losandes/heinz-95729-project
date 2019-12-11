# Users

#### This section provides an example for documenting a data-type.

Legos `/example/legos` are ... They have the following schema:

Property | Type | Description
---- | ---- | -----------
_id | ObjectID | The unique identifier for the user
email | string | The email address of the user (must also be unique in the database)
name | string | The name of the user
password | string | The hashed password that the user choose 



> # Example User

```json
{
       "_id": "5de5d00a31e947558283cc04",
       "name": "Test User",
       "email": "user@gmail.com",
       "password": "^&7U&."
   }
```



## Register `POST`

This endpoint registers a new user ` /users`.

> # Example Request

```endpoint
Method => POST
Payload => {
	"name": "Test User",
	"email": "user@gmail.com",
	"password": "123456"
}
```

> # Example Response `201`

```json
{
   "user": {
       "_id": "5de5d00a31e947558283cc04",
       "name": "Test User",
       "email": "user@gmail.com",
       "password": "^&7U&."
   },
   "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGU1ZDAwYTMxZTk0NzU1ODI4M2NjMDQiLCJuYW1lIjoiUGV0ZXIgWWVmaSIsImVtYWlsIjoieWVmaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6Il4mN1UmLiIsImlhdCI6MTU3NTM0MjA5MCwiZXhwIjoxNTc3OTM0MDkwfQ.wJbzmH61V8wR-rEo7FJI7RIodT3WToEMyUxUgJtINss"
}

```



## Login `POST`

This endpoint signs a user in `POST http://api.example.com/users/login`.

> # Example Request

```endpoint
Payload => {
	"email": "user@gmail.com",
	"password": "123456"
}
```

> # Example Response `200`

```json
{
   "user": {
       "_id": "5de5d00a31e947558283cc04",
       "name": "Test User",
       "email": "user@gmail.com",
       "password": "^&7U&."
   },
   "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGU1ZDAwYTMxZTk0NzU1ODI4M2NjMDQiLCJuYW1lIjoiUGV0ZXIgWWVmaSIsImVtYWlsIjoieWVmaUBnbWFpbC5jb20iLCJwYXNzd29yZCI6Il4mN1UmLiIsImlhdCI6MTU3NTM0MjA5MCwiZXhwIjoxNTc3OTM0MDkwfQ.wJbzmH61V8wR-rEo7FJI7RIodT3WToEMyUxUgJtINss"
}
```
