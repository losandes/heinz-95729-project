const api = {
  bootstrap: require('./compose-bootstrap.js'),
  compose: {
    domains: require('./compose-domains.js'),
    app: require('./compose-app.js'),
  },
  migrate: require('./compose-migrate.js'),
  start: require('./compose-start.js'),
  test: require('./compose-test.js'),
  exit: require('./compose-exit.js'),
}

api.bootstrap()
  .then(api.compose.domains)
  .then(api.compose.app)
  .then(api.migrate('up'))
  .then(api.start)
  .then(api.test)
  .catch(api.exit)
