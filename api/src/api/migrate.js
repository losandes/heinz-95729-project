const api = {
  bootstrap: require('./compose-bootstrap.js'),
  compose: {
    domains: require('./compose-domains.js'),
  },
  migrate: require('./compose-migrate.js'),
  test: require('./compose-test.js'),
  exit: require('./compose-exit.js'),
}

function Arg (name) {
  return { switch: name.toUpperCase() }
}

const findMatch = (switchesOrOptions, argValue, idx, args) => {
  const target = switchesOrOptions
  const _argValue = argValue.trim().toUpperCase()

  if (
    target.option &&
    args.length >= idx + 2 && ( // length is 1 based, and idx is 0 based so add 2
      target.option === _argValue ||
      target.switch === _argValue
    )
  ) {
    return args[idx + 1]
  } else if (
    target.switch === _argValue ||
    target.option === _argValue
  ) {
    return true
  }

  return false
}

let direction = 'up'

if (Array.isArray(process.argv)) {
  process.argv.forEach((value, idx, args) => {
    const down = findMatch(Arg('down'), value, idx, args)

    if (down) {
      direction = 'down'
    }
  }) // /forEach
}

if (direction === 'up') {
  api.bootstrap()
    .then(api.compose.domains)
    .then(api.migrate('up'))
    .then(api.test)
    .then((context) => {
      context.knex.destroy()
      return context
    })
    .catch(api.exit)
} else {
  api.bootstrap()
    .then(api.compose.domains)
    .then(api.migrate('down'))
    .then((context) => {
      context.knex.destroy()
      return context
    })
    .catch(api.exit)
}
