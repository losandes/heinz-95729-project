# Heinz-95729 Web App

## Getting Started

**Before following the instructions in this README, follow the instructions in [api directory](../api)**

Install the package dependencies:

```Shell
(/web) $ pnpm install
```

> NOTICE all the commands are using `pnpm`, not `npm`. See [../api/adr/20210207-choose-package-manager.md](../api/adr/20210207-choose-package-manager.md) for more information.

## Starting the App

Before starting this app, [start the API](../api)

```Shell
(/web) $ pnpm run watch
```

Then navigate to the app in your browser: http://localhost:3001

> NOTE: `pnpm run watch` uses nodemon, which monitors the filesystem, and restarts the app when you make changes. This is not a tool we would use in production. `pnpm start` runs the app without monitoring for changes, which is how we would start the app in production.

## Signing in

If you started the API or ran `pnpm run migrate:up` in the [api directory](../api), the following users should exist: `shopper1@95729.com`, `shopper2@95729.com`, `shopper3@95729.com`, `shopper4@95729.com`. All you need is the email address to sign in.


## Folder structure

- node_modules (third party js libs)
- images (book covers, product images, etc.)
- scripts (javascript)
    - common
        - environment.js (mock nconf style configuration accessor)
        - module-shim (shim that adds support for authoring modules using `module.exports`)
        - Repo.js (fetch abstraction to simplify / proxy server requests)
        - router.js (page.js abstraction to enhance req.context)
        - storage.js (session/local storage abstraction)
    - home (the home component)
    - products (the products component)
    - books (the books component)
    - users (the users component)
    - index.js (composition root / app startup)
- styles (CSS)
- index.html (SPA markup / HTML)
- server.js (The HTTP host to make this available on port 3001)

## The Module Pattern
This application uses a specific module pattern that works with [hilary](https://github.com/losandes/hilaryjs/tree/master/docs) to meet the Dependency Inversion Principle. The `module-shim` allows us to define new modules so other modules can begin to depend on them in two steps:

First, define a new module:

```JavaScript
// greeter.js
module.exports = {
  scope: 'heinz',               // usually the same for all of your modules
                                // (hilary supports multiple scopes)
  name: 'greeter',              // The name other modules will depend on
  dependencies: ['router'],     // The names of the modules this depends on
  factory: (router) => {        // The factory that returns this module,
    'use strict'                // after it's dependencies are resolved

    return {
        sayHello: () => { console.log('hello world!') }
    }
  }
}
```

Second, add the new file in a script tag in index.html:

```HTML
<script src="/scripts/greeter.js"></script>
```

And that's it - your modules can now depend on 'greeter', and call `greeter.sayHello()`.


## Adding Components
Each component is made up of:

* Component (the HTML, and the state)
* Model (the data, also referred to as a ViewModel)
* Controller (the route bindings, and behaviors)
* Repository (communications with services/APIs)

### Defining a Model
We use models to enforce a schema for the data we represent in our components, and to add behaviors/event handlers. Since the component depends on a model, it's a good place to start. If you're more comfortable starting with the HTML, that's fine too - skip to [Defining a Component](#defining-a-component). Our app presents products, and we have a specific component model for _books_. Let's add _movies_.

```JavaScript
module.exports = {
  scope: 'heinz',
  name: 'Movie',
  dependencies: ['router', 'Product'],
  factory: (router, Product) => {
    'use strict'

    return function Movie (movie) {
      const self = new Product(movie)
      movie = Object.assign({}, movie)

      // Add actors to the product model
      self.actors = movie.metadata && Array.isArray(movie.metadata.actors)
        ? movie.metadata.actors
        : []

      // override product's `viewDetails` function to redirect to movies
      self.viewDetails = (event) => {
        if (self.uid) {
          router.navigate(`/movies/${self.uid}`)
        }
      }

      return self
    }
  }
}
```

### Defining a Component
The component is where we define our HTML, and where we keep/mutate the state of our component.

The following conventions are required for our components to work:

1. The name of the module MUST have the word, "component" in it.
1. The module's factory must return an object with the an instance of `Vue.component` set to the `component` property

> The composition root finds all modules with "component" in their name (case insensitive), and registers them in Vue.

```JavaScript
module.exports = {
  scope: 'heinz',
  name: 'movieComponent',
  dependencies: ['Vue', 'Movie'],
  factory: (Vue, Movie) => {
    'use strict'

    var state = new Movie()

    const component = Vue.component('movie', {
      template: `
        <div class="movie-component details">
          <h1>{{title}}</h1>
          <div v-for="actor in actors">
            <span>{{actor.name}}</span>
          </div>
          <div>{{description}}</div>
          <img v-if="showThumbnail" :src="thumbnailLink" :alt="thumbnailAlt">
          <a class="btn" :href="detailsLink">READ MORE</a>
          <div class="purchase">
            <button class="btn btn-success btn-buy" v-on:click="addToCart">{{price}}</button>
          </div>
        </div>`,
      data: () => {
        return state
      }
    })

    const setMovie = (movie) => {
      state = movie
    }

    return { component, setMovie }
  }
}
```

> NOTE if you are using Visual Studio Code, you can install an extension that adds syntax highlighting to HTML in string literals in JavaScript files: `code --install-extension natewallace.angular2-inline`

### Defining a Repository
We're using the repository pattern to perform data interactions with our API. This is a fractal pattern: the API uses the repository pattern to read/write data from/to the database, and the web app uses the repository pattern to read/write data from/to the API.

You can write your repository from scratch if you need to (i.e. using fetch). This example leverages the base repository in our common directory.

> NOTE that some teams refer to repositories such as these, as "clients", or "consumers".

```JavaScript
module.exports = {
  scope: 'heinz',
  name: 'moviesRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const get = (uid, callback) => {
      repo.get({ path: `/movies/${uid}` }, callback)
    }

    return { get }
  }
}
```

### Defining a Controller
We also use a fractal pattern to bind activities to routes: the API uses controllers to bind activities to a given route, and the web app uses controllers, as well.

The following conventions are required for our controllers to work:

1. The name of the module MUST have the word, "controller" in it.
2. The module's factory must return an object with the function, `registerRoutes` on it.

> The composition root finds all modules with "controller" in their name (case insensitive), and executes `registerRoutes`. The instance of Vue will be passed as the first argument to `registerRoutes`. Given that you name this argument, `app`, you can tell Vue which component to display by calling: `app.currentView('[COMPONENT_NAME]')`

```JavaScript
module.exports = {
  scope: 'heinz',
  name: 'moviesController',
  dependencies: ['router', 'movieComponent', 'Movie', 'moviesRepo'],
  factory: (router, movieComponent, Movie, repo) => {
    'use strict'

    /**
     * Route binding (controller)
     * @param {Vue} app - the main Vue instance (not the header)
     */
    function registerRoutes (app) {
      router('/movies/:uid', (context) => {
        repo.get(context.params.uid, (err, movie) => {
          if (err) {
            console.log(err)
            // TODO: render error view
          }

          if (movie) {
            movieComponent.setMovie(new Movie(movie))
            app.currentView = 'movie'
          } else {
            // TODO: route to a "none found" page
            router.navigate('/')
          }
        })
      })
    }

    return { registerRoutes }
  }
}
```

### Registering The Component
All we need to do to add the component we just built to our app, is add it to index.html:

```HTML
    <script src="/scripts/movies/Movie.js"></script>
    <script src="/scripts/movies/movieComponent.js"></script>
    <script src="/scripts/movies/moviesController.js"></script>
    <script src="/scripts/movies/moviesRepo.js"></script>
```
