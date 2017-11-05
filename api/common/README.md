# Introduction

This API is a REST API. It is built on HTTP standards, with intuitive URIs, leveraging HTTP response codes and HTTP verbs that can be consumed by off-the-shelf HTTP clients. It uses cross-origin resource sharing (CORS) to support secure interactions between your client and our resources. All responses are in JSON format, including payloads associated with errors.

> # API Endpoint

```no-highlight
https://api.example.com
```

# Versioning

By default, all requests receive the latest version of the API. We encourage you to explicitly request a version by date via the Accept header. When requesting a resource via a date, you are able to get the latest version, as of the time that you are developing. Future changes to the API will be ignored by your client, unless you change the date.

> # Accept Header with Version

```
Accept: application/json;version=20150820
```

> # Example Request

```bash
# When the `-I` flag is used with `curl`, only the document info is displayed (HEAD).
# When the `-H` flag is used with `curl`, you can add a custom header to pass to the server.
curl "http://localhost:3000/example/legos" -I \
    -H "Accept: application/json;version=20150820"
```

```js
$.ajax({
    type: 'GET',
    url: '/example/legos/',
    dataType: 'json',
    crossDomain: true,
    headers: {
        "Accept": "application/json;version=20150820"
    }
}).done(function (data, status, jqXhr) {
    console.log(jqXhr.getAllResponseHeaders());
});
```

You can check the current version through every response’s headers. Look for the `X-API-Version` header:

> # Example Response Header

```http
X-API-Version: 20150820
```

#### **Important**: The default version of the API may change in the future. If you're building an application and care about the stability of the API, be sure to request a specific version in the `Accept` header as shown in the examples.

# HTTP Status Codes

This API uses these HTTP Status codes

Error Code | Meaning
---------- | -------
200 | Success -- rejoice
201 | Created -- a new resource was created successfully
202 | Accepted -- The request was accepted and queued, actual success will be delivered via notifications
400 | Bad Request -- Umm. I don't know. Who am I?
401 | Unauthorized -- Did you authenticate first? Do you have a JWT token in your headers?
403 | Forbidden -- You are not authorized to access the resource you requested
404 | Not Found -- The endpoint could not be found
405 | Method Not Allowed -- The method/verb you requested is not supported
406 | Not Acceptable -- You requested a format that isn't JSON
410 | Gone -- The resource was removed from our servers
418 | I'm a teapot
429 | Too Many Requests -- You're requesting too many resources! Slow down!
500 | Internal Server Error -- We had a problem with our server. Try again later.
503 | Service Unavailable -- We're temporarily offline for maintenance. Please try again later.

# Telling a Story
The scope of a controller is to accept a request, provide security, and then orchestrate the work that needs to be done to fulfill the request. Using `async.waterfall`, our routes can tell a story, and reveal all of the work being done, to a reader.

From this example controller, I can see that when getting a profile by id:

1. the flow depends on the {id} param
2. that we're getting a document from the DB
3. that we're binding it to a model
4. and that there are values that are encrypted

```JavaScript
module.exports.name = 'profileController'
module.exports.dependencies = ['async { waterfall }', 'router', 'getProfileTasks']
module.exports.factory = (waterfall, router, getTasks) => {
  'use strict'

  router.get('/profiles/:id', function (req, res) {
    waterfall([
      function (callback) { callback(null, req.params.id); },
      getTasks.getDocument,
      getTasks.bindToModel,
      getTasks.decrypt
    ], function (err, profile) {
      if (err) {
        return res.status(400).send(/*...*/)
      }

      res.status(200)
        .send(profile)
    })
  })

  return router
}
```

Example tasks for that controller:

```JavaScript
module.exports.name = 'getProfileTasks'
module.exports.singleton = true
module.exports.dependencies = ['Profile', 'usersRepo']
module.exports.factory = (Profile, repo) => {
  'use strict'

  const getDocument = (id, callback) => {
    repo.db.find({ _id: id }, callback)
  }

  const bindToModel = (doc, callback) => {
    var profile = new Profile(doc)

    if (profile.isException) {
      callback(profile)
    } else {
      callback(null, profile)
    }
  }

  const decrypt = (profile, callback) => {
    // TODO: decrypt sensitive values
    callback(null, profile)
  }

  return  {
    getDocument,
    bindToModel,
    decrypt
  }
}
```

## Same Examples With Promises
Promises offer control-flow capabilities without using an third-party library. To abstract the control-flow implementation from our tasks, we can write them much like we do in the examples above, except that the arguments that each task accepts are always the same: `payload, resolve, reject`, where `payload` represents the value that was resolved by the previous promise in the _then_ stack.

#### NOTE that by keeping the promises out of our tasks, and only using them to control-flow, we achieve a comprehensible order of operation. The task functions aren't executed until we reach them in the `then` stack. Why? because Promises are not lazy - they execute immediately, and produce a value when `then` is called. Each time a `then` is called, the value from the initial execution is returned, rather than the promise executing again. To see that in action, run this line: `var p1 = new Promise((resolve, reject) => { console.log('executed'); resolve(42) });`. Note that "executed" is printed to the console, immediately. Then run `p1.then(val => { console.log(val) })` several times. You'll see the value get printed to the console over and over again, but you will never see "executed" again, unless you restart your process.

#### Also NOTE that while async.js logs an error, if you execute the `callback` more than once, Promises do not afford protection from calling `resolve`, or `reject` more than once. The first execution of either of these functions is the winner. Executions that come later are are silently ignored :disappointed:.

```JavaScript
module.exports.name = 'profileController'
module.exports.dependencies = ['router', 'getProfileTasks']
module.exports.factory = (router, getTasks) => {
  'use strict'

  router.get('/profiles/:id', function (req, res) {
    Promise.resolve(req.params.id)
      .then(context => new Promise(getTasks.getDocument(context)))
      .then(context => new Promise(getTasks.bindToModel(context)))
      .then(context => new Promise(getTasks.decrypt(context)))
      .then(function (profile) {
        res.status(200)
          .send(profile)
      }).catch(function (err) {
        return res.status(400).send(/*...*/)
      })
  })

  return router
}
```

Example tasks for that controller:

```JavaScript
module.exports.name = 'getProfileTasks'
module.exports.singleton = true
module.exports.dependencies = ['Profile', 'usersRepo']
module.exports.factory = (Profile, repo) => {
  'use strict'

  // The `id` value is the "payload" in this context
  const getDocument = (id) => (resolve, reject) => {
    // Note that we assume `repo.db.find` is a Promise in this scenario
    // Instead of returning the Promise, we execute it when this
    // function is called. The parent's resolve, and reject functions
    // are passed to it. This keeps the control-flow symmetric / consistent,
    // as the control flow doesn't need to know whether or not the
    // task returns a Promise, or not.
    return repo.db.find({ _id: id })
        .then(resolve)
        .catch(reject)
  }

  // The `doc` value is the "payload" in this context
  const bindToModel = (doc) => (resolve, reject) => {
    var profile = new Profile(doc)

    if (profile.isException) {
      return reject(profile)
    } else {
      return resolve(null, profile)
    }
  }

  // The `profile` value is the "payload" in this context
  const decrypt = (profile) => (resolve, reject) => {
    // TODO: decrypt sensitive values
    return resolve(profile)
  };

  return {
    getDocument: getDocument,
    bindToModel: bindToModel,
    decrypt: decrypt
  }
}
```
