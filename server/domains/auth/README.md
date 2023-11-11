# Server Auth Middleware

Koa middleware for authentication and authorization.

## Installation

Add the following to your package.json dependencies and make sure that the link path is valid
```
"@rnp-forecast": "link:../server-lib/auth"
```

## Usage (Routes)

- `login`: authenticates the user and adds a session cookie to the session
- `authorize`: redirects the user back to the web app, which is presumable running at a different host or port
- `logout`: tells the browser to remove the session cookie
- `deauthorize`: redirects the user back to the web app, which is presumable running at a different host or port
- `testSession`: koa middleware that exposes whether or not a valid session is present (e.g. so the web app can conditionally show login and logout buttons)

```js
import Koa from 'koa'
import Router from 'koa-router'
import {
  login,
  logout,
  authorize,
  deauthorize,
  testSession,
} from '@rnp-forecast/auth'

const app = new Koa()
const router = new Router()
const SERVER_ORIGIN = 'http://localhost:3001'
const CLIENT_ORIGIN = 'http://localhost:3000'

router.post('/login', login((ctx) => `${SERVER_ORIGIN}/authorize`))
router.get('/authorize', authorize(`${CLIENT_ORIGIN}/auth/authorized`))
router.post('/logout', logout((ctx) => `${SERVER_ORIGIN}/deauthorize`))
router.get('/deauthorize', deauthorize(`${CLIENT_ORIGIN}/auth/login`))
router.get('/session/test', testSession())

app.use(router.routes())
```

> Note that for the cURL examples, you may need to escape the body differently on your operating system. See comments in the answer to Stack Overflow's [How Do I POST JSON Data With cURL](https://stackoverflow.com/questions/7172784/how-do-i-post-json-data-with-curl)

### HTTPie request examples

```shell
# login
http POST http://localhost:3001/api/login \
  <<< '{ "email": "shopper1@95729.com" }'

# logout
http POST http://localhost:3001/api/logout

# verify that the session is valid
http POST http://localhost:3001/api/session/test
```

### cURL request examples

```shell
# login
curl --header "Content-Type: application/json" \
  --request POST \
  --data "{\"email\":\"shopper1@95729.com\" }" \
  http://localhost:3001/api/login

# logout
curl --request POST http://localhost:3001/api/logout

# verify that the session is valid
curl --request POST http://localhost:3001/api/session/test
```

## Usage (Middleware)

- `requireSession`: koa middleware that produces a 404 response when a request to access a protected route is made without a valid session

```js
import Koa from 'koa'
import Router from 'koa-router'
import { requireSession } from '@rnp-forecast/auth'

const app = new Koa()
const router = new Router()

router.get(
  '/protected/route',
  requireSession(),
  (ctx) => {
    // only runs if a valid session is present
  }
)

app.use(router.routes())
```

- `verifySession`: koa middleware that verifies the session and adds approprate session data to the `ctx.state`

```js
import Koa from 'koa'
import { verifySession } from '@rnp-forecast/auth'

const app = new Koa()

app.use(verifySession())
```
