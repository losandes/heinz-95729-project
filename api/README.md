# Heinz-95729 API 

##### - APIs, Web UX, and Integration Group(2019)

## Getting Started
This app is composed with [hilary](https://github.com/losandes/hilaryjs), uses [@polyn/blueprint](https://github.com/losandes/polyn-blueprint), and [@polyn/immutable](https://github.com/losandes/polyn-immutable) for models, and runs on [express](http://expressjs.com).

The first time you run the app, or any time you make changes to the [seed files](common/build-tasks):

```
npm run seed
```

To start the app:

```
npm run dev
```

Navigate to http://localhost:3000 to see the documentation

> NOTE: `npm run dev` uses nodemon, which monitors the filesystem, and restarts the app when you make changes. This is not a tool we would use in production. `npm start` runs the app without monitoring for changes, which is how we would start the app in production.

### Adding New APIs
1. At the root-level of the app, add a new folder, describing the type of the new API (i.e. Users, Legos, etc.)

2. To that new folder, add a controller, and any necessary supporting files, such as Models, and tests.

3. Add an `index.js` to that folder that exports all files in the folder in an array:

```JavaScript
// models/index.js
module.exports = [
  require('./Model.js'),
  require('./modelController.js')
  // ...
]
```

4. `require` that index in `composition.js`:

```JavaScript
// composition.js
scope.bootstrap([
    // ...
    scope.makeRegistrationTask(require('./models')),
    // ...
], (err) => { /*...*/ })
```

> NOTE: all modules that have the word "controller" in their name will be executed during startup to register the routes that are defined in them.

Example Controller:
```javascript
module.exports.name = 'userController';
module.exports.dependencies = ['router'];
module.exports.factory = function(router) {
    'use strict';

    router.get('/users', function (req, res) {
        res.send('hello world');
    });
};
```

## Directories
This project is organized with a [screaming architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html), as opposed to _capability-driven_ folders. Definitions follow:

> **folders in a screaming architecture**: folders that are named after the domain boundaries (i.e. Pricing, Broker, Product, etc.)

> **capability-driven folders**: folders that are named after the job that they perform (i.e. Controllers, Repositories, Models, etc.)

### root
The root of the app includes:

* **app.js**: the entry point of the app

* **composition.js**: where we bootstrap hilary, and compose our dependency graph. It's the [composition root](http://blog.ploeh.dk/2011/07/28/CompositionRoot/) of the app.

* <span style='color:red'>test.js</span> : where we bootstrap the required testing dependencies. Since we are using a `test_db` to implement all of our tests. 

  ### To run our tests:

  * please navigate to `/api/common/build-tasks/seed.js` 
  
  * modify the testdb: `test_db:host`, `test_db:port`,`test_db:name`

    ```JavaScript
    // composition.js
    MongoClient(new Server(env.get('test_db:host'), parseInt(env.get('test_db:port'))))
        ...
      const db = client.db(env.get('test_db:name'))
    ], (err) => { /*...*/ })
    ```
  * re-run the seed under the `/api` directory

    ```
    npm run seed
    ```
  * then run the test 
     ```
    npm test
    ```



### home

The home folder contains the default/home controller, which responds to requests to the root of this API. It renders the README files as HTML. Visit the home page of this API and click, _About_ to learn more.

### legos
The legos folder contains an example API controller and documentation.

### common
The common folder includes code to run the server, as well as utilities that might be used by other modules. There are some files

#### common/environment
This, git-ignored folder, is where you can define your environment-specific variables. It's also where you register app versions, and README rendering for the home page.

> Note that _environment.js_ exposes a configured instance of [nconf](https://github.com/indexzero/nconf).

#### common/loggers
You'll probably want to edit the `logger` module in this directory. It's the default logger, and just logs to the console.

#### common/express
This API is built on [express](http://expressjs.com), which is configured in this directory. You will also find custom middleware in this directory, for CORS, and API Versioning.

#### common/tests
If you chose to install the tests, the tests folder contains modules to help you test with dependencies.

### public
This folder is accessible by the client. This is where you should put any scripts, CSS, or assets that you want clients to have access to.

### views
This folder contains the HBS files, for rendering web pages.

### users
The user folder contains:

- Index module: re-export the product subsets.
- Four modules: user, controller, repository, <span style='color:blue'>userRepo test </span>.
- Actions: serve as the intermedia for the controller and repository. 
  - getUser
  - login
  - register

### products

The products folder contains:
- Index module: re-export the product subsets.
- Four modules: product, controller, repository, and <span style='color:blue'>productRepo test </span>.
- Actions: serve as the intermedia for the controller and repository. 
  - getProduct
  - searchProducts


### books
The books inherit the product and the book folder contains:

- Index module: re-export the product subsets.
- Two modules: book, controller. 
- Actions: serve as the intermedia for the controller and repository. 
  - getBook
  - getBooks
  - searchBooks

### books-path

This folder contains pdfs for books.

### shopping-cart

The shopping-cart folder contains:

- Index module: re-export the product subsets.

- Four modules: cart, controller, repository, and <span style='color:blue'>cartRepo test</span>.

- Actions: serve as the intermedia for the controller and repository. 

  - addToCart

  - addToExistingCart

  - updateCart


### orders

The orders inherit the products and the orders folder contains:

- Index module: re-export the product subsets.
- Four modules: product, controller, repository, and  <span style='color:blue'>ordersRepo test</span>.
- Actions: serve as the intermedia for the controller and repository. 
  - addOrder
  - findOrders
  - orderDownload
  - sendEMail
- email-templates folder for pdf downloading through email




