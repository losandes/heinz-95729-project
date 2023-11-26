# CMU Heinz 95729 Course Project

This repository provides a foundation for Heinz 95729 E-Commerce Tech course projects that include APIs, and/or web apps.

The primary technologies include:

- [Koa](https://koajs.com/) to run the api server
- [SQLite](https://www.sqlite.org/index.html) for a quick start for relational data (you can swap this out with a database of your choice)
- [Vite](https://vitejs.dev/) for the dev and build server (web and api)
    - [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/)
- [React](https://react.dev/) for interactive components in the client
- [vitest](https://vitest.dev/) for testing
- [Tailwindscss](https://tailwindcss.com/) for styling with additional dependencies on [HeadlessUI](https://headlessui.com/) and [Heroicons](https://heroicons.com/)
- [Zod](https://zod.dev/) for schema definition, typings, and schema validation
- [Zustand](https://github.com/pmndrs/zustand) for state management

## Directory Structure

-   **adr/**: ("Architectural Decision Records") Records that document important decisions and practices or this repository
-   **api/**: the server
    -   **api/data_volumes/**: ("source") sqlite database file(s)
    -   **api/src/**: ("source") The files developers write to produce the api
        -   **api/src/domains**: the domains the api exposes
        -   **api/src/lib**: tooling for the api
        -   **api/src/server**: koa middleware and tooling
-   **bin/**: ("binaries") Scripts that help developers orchestrate (i.e. running tests, building code, etc.)
-   **configs/**: Configuration files for ENVVARs, ESLint, TypeScript, and Tailwind
-   **dist/[ENVIRONMENT]/**: ("distribution") The rendered code, or library that will be deployed, or consumed (if applicable).
-   **node_modules/**: Root level dependencies that are added via dependency management
-   **public/**: Static files that will be served as part of the application
-   **src/**: ("source") The files developers write to produce the web app
    -   **src/domains**: the domains the pages consume
    -   **src/layouts**: the scaffolding for the pages
    -   **src/lib**: tooling for the web app
    -   **src/pages**: the web pages

_NOTE the "dist" folder is volatile, and will be managed as part of CI/CD. The "node_modules" folder is also volatile and is gitignored._


```
.
├── api
│   ├── data_volumes
│   └── src
│       ├── domains
│       ├── lib
│       └── server
├── bin
├── configs
│   ├── es (eslint)
│   └── tailwind
├── public
│   ├── images
│   └── logo
└── src
    ├── domains
    ├── layouts
    ├── lib
    └── pages
```

## Context about code organization and directory structures

## Context: Prerequisites

Are you familiar with the following? Even if you are, at least skim those links before continuing.

-   [Domain-Driven Design (DDD)](https://en.wikipedia.org/wiki/Domain-driven_design)
-   [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/)

From those readings, the following terms will be used throughout this document

-   **Atoms**: foundational building blocks that comprise all our user interfaces (e.g. basic HTML elements like form labels, inputs, buttons, and others that can’t be broken down any further without ceasing to be functional)
-   **Molecules**: relatively simple groups of UI elements functioning together as a unit (e.g. a form label, search input, and button can join together to create a search form molecule)
-   **Organisms**: relatively complex UI components composed of groups of molecules and/or atoms and/or other organisms (e.g. a header organism that includes a search form molecule)
-   **Templates**: page-level objects that place components into a layout and articulate the design’s underlying content structure (e.g. a homepage template that includes the header organism)
-   **Pages**: specific instances of templates that with real representative content in place
-   **Stages**: The 5 stages of Atomic Design: Atoms, Molecules, Organisms, Templates, and Pages
-   **Domain**: the scope of responsibility for a microservice or micro frontend, emphasizing the separation of concerns between different parts of the application
-   **Domain Components**: organisms and templates that are specific to a domain

## Getting Started

### ENVVARS

See _.env-example_ for a list of ENVVARS. You can set these either by adding a _.env_ file to the root folder of this project, or using `export ENVVAR_NAME=value`.

### Install the dependencies

These commands assume your terminal is in the same directory as this README. Prior to executing the terminal commands:

1. Install [NodeJS 20+ LTS](https://nodejs.org/) (I recommend [installing it](https://github.com/asdf-vm/asdf-nodejs) with [asdf](https://github.com/asdf-vm/asdf) if your on mac or linux)


```Shell
# Install pnpm (this is necessary as long as this is a mono-repo)
npm install -g pnpm

# Install the app's dependencies
pnpm install
cd api
pnpm install
cd ../

# Initialize your .env and data_volumes
pnpm init:env
# Review .env

# Start the app in _watch_ mode
pnpm run dev
```

> NOTICE all the commands are using `pnpm`, not `npm`. See [adr/20200416-choose-package-manager.md](adr/20200416-choose-package-manager.md) for more information.

Once the app is running, you can check it out at:

- [Web home page](http://localhost:5173)
- [Sign in](http://localhost:5173/profile/login)

## Running the tests

This app uses [vitest](https://vitest.dev/) for testing.

```shell
# run the tests once
pnpm test

# run tests for the code that changed each time you save
pnpm test:watch
```

## Enhancing the Web App

### Adding Pages

The pages in this structure are responsible only for the composition of the layout and the "templates" (in reference to Atomic Design, referenced above). There should be very little code in the pages TSX files.

The router auto-maps the files in the pages directory, so all you have to do is add a new `*.tsx` file (or directory and file) to the pages directory.

To add a parameterized route, create a directory and wrap the directory name in `[]`. The directory name will be converted to camelCase and any value placed in the route at that location will be passed to useParams.

```tsx
// src/pages/products/books/[book-id]/index.tsx
//   [book-id] is converted to :bookId

// src/pages/products/books/123/index.tsx
//   bookId => 123

// src/pages/products/books/hello-world/index.tsx
//   bookId => hello-world

import { useParams } from 'react-router-dom'
import Layout from '@layouts/Default'

export default function () {
  const { bookId } = useParams()

  return (
    <Layout>
      <h1>Books</h1>
      <p>Book ID: {bookId}</p>
    </Layout>
  )
}
```

### Adding Domains

The content for the pages is in the "domains" folder. In the domains folder, you'll find code is grouped together by contexts, such as profile, about, and products.

Each domain has an index.tsx file at it's root. This is where you export the public members of the domain. When depending on a domain, whether it be from another domain, or pages, you should only depend on the index, not directly on the src code inside the domain. This is called loose coupling and makes it easier to refactor the code.

Each domain has a src folder and inside that, you'll find a variety of folders. Folders that include components follow Atomic Design conventions. These folders are prefixed with an underscore to keep them grouped together (e.g. _atoms, _molecules, _organisms, and _templates). You'll find zustand stores in the state folders. Zod schemas (type definitions) in the typedefs folders. Not every domain requires every folder.

Here's an example

```shell
├── index.tsx
└── src
    ├── _molecules
    │   ├── ColorPalette.tsx
    │   ├── ColorSwatch.tsx
    │   └── Typography.tsx
    ├── _templates
    │   └── About.tsx
    ├── state
    │   └── palette-store.ts
    └── typedefs
        ├── color-palette.ts
        └── color-swatch.ts
```

### Fetching from the API

In the `src/lib` folder, you'll find a _fetch_ folder with a _use-fetch-hook.tsx_ hook in it. Check out `src/domains/about/src/_templates/About.tsx` for a complete example for using it. Fetching data is something we need to do a lot of, and for some reason, it's really complicated in React, so the `useFetch` hook solves most of the complexity for you.

```tsx
import { join, useFetch } from '@lib/fetch'
import usePaletteStore from '../state/palette-store'
import colorPalette from '../typedefs/color-palette'

function About () {
  // The paletteStore holds the state for ColorPalettes
  // Any time the palettes in this store are updated
  // this component will re-render because we're using
  // the state here.
  const palettes = usePaletteStore((state) => state.palettes)

  const [
    // if the API request fails, the error will be defined
    paletteFetchErr,
    // use this boolean to show loading symbols while the
    // user waits
    palettesLoading,
    // use the text status to add text to loading symbols
    // and to alt tags to make it accessible.
    paletteFetchStatus,
  ] = useFetch<colorPalette[]>(
    // the URL we are fetching from
    join(env.PUBLIC_API_ORIGIN, '/api/palettes'),
    // the schema useFetch will validate the response with
    z.array(colorPalette),
    // the callback, where we can update the paletteStore
    // with the data we received from the server (which
    // will cause a re-render)
    (palettes) => { usePaletteStore.setState({ palettes }) },
  )

  // ...
}
```

## Enhancing the API

## Adding Routes

The API responds to routes. This API is configured to run in a proxy, so all routes are prefixed with `/api`. The routes are defined in the `api/index.ts` file. We're using koa for the server and [koa-router](https://github.com/koajs/router#readme) to define the routes. Routes use HTTP verbs and the following are the ones you'll use the most:

-  delete: delete resource(s)
-  get: get resource(s)
-  patch: partially update resource(s)
-  post: create resource(s)
-  put: update resource(s)

Read the Endpoint Modality reading in the #readings channel for more information.

```ts
// a simple get request that returns JSON
router.get('/hello', (ctx) => {
  ctx.body = { hello: 'world' }
})

// middleware can be pass in the args to produce
// side effects. In this example, a `requireSession`
// middleware is passed before the request handler.
// Presumably, given it's name, it will stop the
// request from being handled if the user isn't
// signed in.
router.get('/hello/secret', requireSession(), (ctx) => {
  ctx.body = { hello: 'secret' }
})
```

## Adding Domains

Like the web app, the api functionality is broken into contexts, which you'll find in the domains folder. The structure is identical (as described above). The folders in the src folder are slightly different, with io for database calls or 3rd party API integrations, middleware for the koa route handlers, typedefs for schema definitions, loaders for dealing with bulk data, and resolvers for querying data (Screaming Repository Pattern: a file per Create, Read, Update, Delete (CRUD) action, such as get-user-by-id, get-user-by-email, list-users, find-user, etc.).

Each time you add a domain with middleware / routes, you need to register that route in the `api/index.ts` file.

## Seeding Data

Look at the users domain for an example of how to seed the database. In `api/src/domains/users/src/loaders/seeds/seeds.ts` there is a dataset that meets the schema defined in `api/src/domains/users/src/typedefs/user.ts` and the data is mapped to an array of key-value-pairs.

These key-value-pairs are consumed by `api/src/server/src/init-db.ts` to populate the database if the data isn't already present. init-db doesn't reconcile all of the data... just the seed ids.

```ts
// a single record that will be persisted
// in the database
type Record = {
  key: string,
  value: any,
}

// a seed has a seed identifer and an array
// of records to be written
type Seed = {
  id: number,
  records: Record[]
}
```

Note that in `api/src/domains/users/src/loaders/seeds/seeds.ts`, the data is mapped to key-value-pairs with two different keys: the user id, and their email address. The userId key points at the entire record. The email key points at the userId, which can then be used to look up the record. This is called a binary lookup: we intentionally index the data by any key we expect to retrieve it with. To read more about key-value-storage patterns, check out the Data Design Patterns reading in the #readings channel.
