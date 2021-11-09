# Compose App and Domains

## Status

accepted

## Context

When working with a domain driven and/or screaming architecture we need a strategy for loosely coupling domains, to compose the features of our app.

## Decision

Each domain will have a composition root (index.js) that is responsible for composing the domain. In order to avoid tight coupling, domains will not depend directly on each other. Instead, an app composition root (app.js) will be responsibile for composing the app, all of it's domains, and their inter-dependencies.

In example:

```JavaScript
/**
 * app.js
 * This is the composition root for the app. It is where we compose all of
 * the domains that are necessary for the app to perform it's work. Part of
 * it's purpose is to connect loosely coupled domains together.
 */
// ...
import Envvars from './env'
import { database } from './db'
// ...
import { Home, EVENT as HOME_EVENT } from './app/home'
// ...
const home = Home({ database, Envvars })
```

```JavaScript
/**
 * app/home/index.js
 * This is the composition root of the Home domain. It is where we compose
 * all of the modules that make up the home domain. It should not depend
 * directly on other domains, and should instead expect those dependencies
 * by injected on app startup.
 */
import { HomeRepo } from './home-repo'

/**
 * Home domain
 * @param {CosmosClient} database - an instance of the database client
 */
export const Home = (args) => {
  const { database, Envvars } = args
  const repo = new HomeRepo({ database })

  const publishHome = async (client, { botToken: token }, event) => {
    // ...

    // Get data from DB
    const requests = await repo.requests.byTeamTypeAndStatus()
    const installations = await repo.installations.list()

    // ...
  }

  return { publishHome }
}
```

```JavaScript
/**
 * app/home/home-repo.js
 * @param {CosmosClient} database - an instance of the database client
 */
export const HomeRepo = (args) => {
  const { database } = args
  const dbRequests = database.container('requests')
  const dbInstallations = database.container('installations')

  const SQL_QUERIES = {
    REQUESTS: {
      AGG_BY_TEAM_TYPE_STATUS: 'SELECT r.type as request_type, r.teamId as request_team_id, r.status as request_status, COUNT(1) as n_requests FROM requests r GROUP BY r.type, r.teamId, r.status',
    },
    INSTALLATIONS: {
      ALL: 'SELECT i.installation.team.name as team_name, i.installation.team.id as team_id FROM installations i',
    },
  }

  const resourceFetcher = (query) => async () => {
    const { resources } = await query.fetchAll()
    return resources
  }

  return {
    requests: {
      /**
       * Returns requests aggregated by team id, request type, and request status
       */
      byTeamTypeAndStatus: resourceFetcher(dbRequests.items.query(SQL_QUERIES.REQUESTS.AGG_BY_TEAM_TYPE_STATUS)),
    },
    installations: {
      list: resourceFetcher(dbInstallations.items.query(SQL_QUERIES.INSTALLATIONS.ALL)),
    },
  }
}
```

> NOTE  that the SQL queries are defined in the repository. It would also be fine for them to be defined in the home domain. It may also be fine for them to be defined at the root level, or in the db folder, as they are in this PR. In that case, they should be injected, like the `database` is. In practice, I find that it's easier to work on repositories that have the queries in them, because I can see everything in one file.

## Consequences

When adding new files, or dependencies between files, developers have to touch the effected composition roots. This can feel repetitive and mundane, however it makes it easier to refactor applications in the future, as well as to test them.
