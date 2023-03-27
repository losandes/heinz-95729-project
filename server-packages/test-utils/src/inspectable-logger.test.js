import test from 'supposed'
import expect from 'unexpected'
import { makeInspectableLogger } from './inspectable-logger.js'

const givenLogger = 'given @heinz-95729/test-utils makeInspectableLogger'

test([givenLogger,
  'it should include a logs property from which logs can be inspected'].join(', '),
async () => {
  const logger = makeInspectableLogger()
  logger.emit('includes_inspectable_logger', 'info', { foo: 'bar' })
  logger.emit('includes_inspectable_logger', 'info', { foo: 'baz' })

  expect(logger.logs()[0].log.foo, 'to equal', 'bar')
  expect(logger.logs()[0].meta, 'to satisfy', {
    event: 'includes_inspectable_logger',
    category: 'info',
  })
  expect(logger.logs()[1].log.foo, 'to equal', 'baz')
  expect(logger.logs()[1].meta, 'to satisfy', {
    event: 'includes_inspectable_logger',
    category: 'info',
  })
})
