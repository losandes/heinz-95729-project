# Logger

This domain provides an asynchronous EventEmitter for emitting log events.

The emitter takes at least two, usually three, and sometimes more than three arguments. The first two arguments have a specific purpose. Arguments beyond those two are up to you.

The type for `emit` is a curried type that executes once 3 arguments are supplied: level, event, content:

```ts
type EmitsLog = Curry<[LogLevel, string, any], any>

// which unpacks to:
type EmitsLog = {
    (
      level: "info" | "trace" | "debug" | "warn" | "error",
      event: string,
      content: any,
    ): any // returns the content so it can be used in promise chains

    (
      level: "info" | "trace" | "debug" | "warn" | "error",
      event: string,
    ): Curry1<any, any>

    (
      level: "info" | "trace" | "debug" | "warn" | "error",
    ): Curry2<string, any, any>
}
```

where:

-   **level**: the verbosity level of the event: 'trace' | 'debug' | 'info' | 'warn' | 'error'
-   **event**: a snake_case unique key (string) that concisely describes the event (e.g. auth_failed, retrieved_events)
-   **content**: any additional information to be logged

## Levels

The logger uses the NODE_ENV (mode in vite) to set the verbosity.

## Examples

```ts
import logger from 'lib/logger/index.ts'

logger.emit('info', 'auth_success')

// errors should always include the error
logger.emit('error', 'auth_failed', err)

// trace is helpful to evaluate everything that is
// happening as a user navigates the app, similar to
// telemtry, but for real time analysis
logger.emit('trace', 'send_auth_request', { env: import.meta.env })

// debugging logs should be temporary / short lived and
// include all of the information you need to understand why
// the app is behaving as it is
logger.emit('debug', 'temp_auth_not_working', { env: import.meta.env, res })

// warnings are helpful when we want to observe a scenario
// that isn't ideal or expected, but that isn't causing an
// error to occur
logger.emit('warn', 'unexpected_property', { responseBody })

// you can type a little less by using the shorthand versions of the above
logger.info('auth_success')
logger.error('auth_failed', err)
logger.trace('send_auth_request', { env: import.meta.env })
logger.debug('temp_auth_not_working', { env: import.meta.env, res })
logger.warn('unexpected_property', { responseBody })

// among the reasons this is curried is so that it's easy to
// pass to a promise chain
Promose.resolve({ foo: 'bar'})
  .then(log.info('foo_succeeded')) // will include { foo: 'bar'} in logs
  .then((result) => {
    // the log.info above passes the content ({ foo: 'bar'})
    // as the argument to the next then
    throw new Error('Boom!')
  })
  .catch(log.error('foo_failed')) // will include the Boom! error
```

