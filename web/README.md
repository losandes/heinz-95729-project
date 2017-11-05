Customer Support UI
===================

## Getting Started
If you don't already have them, install [node.js](https://nodejs.org/en/), and [bower](https://bower.io).

Install http-server:

```Shell
$ npm install -g http-server
```

Install the web dependencies:

```Shell
(/cusomer-support-ui) $ bower install
```

Start the services, and the app:

```Shell
(/varo-api) $ make run-router
(/varo-api) $ make run-profile
(/varo-api) $ make run-banking
(/cusomer-support-ui) $ npm start
```

## Folder structure

- bower_components (third party js libs)
- config (environment config)
- scripts (javascript)
    - common
        - environment.js (nconf style configuration accessor)
        - Repo.js (fetch abstraction to simplify / proxy server requests)
        - router.js (page.js abstraction to enhance req.context)
        - storage.js (session/local storage abstraction)
        - ViewEngine.js (Vue abstraction to handle component creation, state, and view swapping)
    - module-shim.js (must load first - deals with namespacing / DI)
    - _type_.js
    - index.js (composition root / app startup)
- styles (CSS)
- index.html (SPA markup / HTML)    

## Adding Components
The components follow the [MVVM](https://en.wikipedia.org/wiki/Model–view–viewmodel) pattern. Each component has a:

* Model (the data)
* View (the markup / HTML)
* ViewModel (encapsulates/translates the Model, and adds event handlers, and other view-specific data)

These patterns require several files to be created, and in doing so, we delineate responsibility in a clear manner. While we could collapse these into less files, that often leads to more trouble when refactoring.

Let's say we're adding a new type to the app: Accounts. We'll start by adding a View to index.html. Why? Because this gives us our data requirements.

```html
<!-- index.html -->
<script id="t-accounts" type="text/x-template">
<div class="component">
    <h1 class="page-header">{{title}}</h1>
    <div class="table-responsive">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>{{headings.id}}</th>
                    <th>{{headings.clientId}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="account in accounts">
                    <td>{{account.id}}</td>
                    <td>{{account.clientId}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</script>
```

Now that we have that, we need a JS file: /scripts/accounts.js, so we can add our ViewModel:

```javascript
// /scripts/accounts.js
module.exports({
    name: 'accounts',
    dependencies: [],
    factory: function () {
        'use strict';

        function AccountsViewModel (view) {
            view = view || {};

            var self = {
                title: 'Accounts',
                headings: {
                    id: 'ID',
                    clientId: 'Client ID'
                },
                accounts: Array.isArray(view.accounts) ? view.accounts : []
            };

            return self;
        }
    }
});
```

To that we'll add an Account _data_ model:

```javascript
// /scripts/accounts.js
module.exports({
    name: 'accounts',
    dependencies: [],
    factory: function () {
        'use strict';

        function AccountsViewModel (view) {
            // ...
        }

        function Account (account) {
            var self = {};
            account = account || {};

            self.id = account.id;
            self.clientId = account.clientId;
            // ...

            return self;
        }
    }
});
```

Then, we'll add a Repo _(note that we're adding dependencies to the module)_:

```javascript
// /scripts/accounts.js
module.exports({
    name: 'accounts',
    dependencies: ['Repo'],
    factory: function (Repo) {
        'use strict';

        var accountsRepo;

        function AccountsViewModel (view) {
            // ...
        }

        function Account (account) {
            // ...
        }

        accountsRepo = (function (Repo) {
            var path = '/banking/accounts',
                repo = new Repo({
                    Model: Account
                }),
                self = {
                    list: list,
                    get: get
                };

            function list (options, callback) {
                var qs;
                options = options || {};
                options.skip = parseNumWithDefault(options, 'skip', 0);
                options.limit = parseNumWithDefault(options, 'limit', options.skip + 15);

                qs = '?skip={{skip}}&limit={{limit}}'
                    .replace(/{{skip}}/, options.skip)
                    .replace(/{{limit}}/, options.limit);

                return repo.list({
                    path: path + qs
                }, callback);
            }

            function get (options, callback) {
                return repo.get({
                    path: path + '/' + options.accountId
                }, callback);
            }

            function parseNumWithDefault (options, prop, def) {
                return typeof options[prop] === 'number' ? options[prop] : def;
            }

            return self;
        }(Repo));
    }
});
```

We'll add some routes for the accounts _(note that we're adding dependencies to the module)_. We need to register these routes on startup, so our module needs to export the function that registers these routes.

```javascript
// /scripts/accounts.js
module.exports({
    name: 'accounts',
    dependencies: ['Repo', 'router', 'viewEngine'],
    factory: function (Repo, router, viewEngine) {
        'use strict';

        var accountsRepo;

        function AccountsViewModel (view) {
            // ...
        }

        function Account (account) {
            // ...
        }

        accountsRepo = (function () {
            // ...
        }());

        function registerRoutes () {
            var defaultLimit = 15;

            router('/csui/accounts', function (req) {
                var skip = parseQueryAsNumber(req.query, 'skip', 0),
                    limit = parseQueryAsNumber(req.query, 'limit', skip + defaultLimit);

                accountsRepo.list({
                    skip: skip,
                    limit: limit
                }, function (err, applications) {
                    if (err) {
                        return console.error(err);
                    }

                    viewEngine.render({
                        name: 'accounts',
                        vm: new AccountsViewModel({
                            accounts: accounts
                        })
                    });
                });
            });

            function parseQueryAsNumber (query, prop, def) {
                var val;

                if (!query || !query[prop]) {
                    return def;
                }

                val = parseInt(query[prop]);

                if (isNaN(val)) {
                    return def;
                }

                return val;
            }

        } // /registerRoutes

        return {
            // this is the signature our index.js is looking for
            registerRoutes: registerRoutes
        };
    }
});
```

Now, we'll add the scripts to our index.html

```html
<!-- index.html -->
<script src="/csui/scripts/accounts.js"></script>
```

And finally, if we aren't using an IoC container, we need to resolve our modules, manually:

```javascript
// /scripts/index.js

// ...

function compose (nav, app, config, callback) {
    // ...

    callback(null, nav, app, router, viewEngine, storage, [
        // ...

        // Note this passes the route registration functions forward,
        // in a list, so they can be registered.
        require('accounts').factory(Repo, router, viewEngine),

        // ...
    ]);
}

// ...
```
