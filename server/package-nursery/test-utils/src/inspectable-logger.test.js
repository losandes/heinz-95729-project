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

test([givenLogger,
  'it should prune the oldest logs when the maxLength is reached'].join(', '),
async () => {
  const logger = makeInspectableLogger(2)
  logger.emit('includes_inspectable_logger', 'info', 1)
  logger.emit('includes_inspectable_logger', 'info', 2)
  logger.emit('includes_inspectable_logger', 'info', 3)

  expect(logger.logs()[0].log, 'to equal', 2)
  expect(logger.logs()[1].log, 'to equal', 3)
})

test([givenLogger,
  'it should support a variable number of args'].join(', '),
async () => {
  const logger = makeInspectableLogger()
  logger.emit('includes_inspectable_logger', 'info', 1, 2, 3)

  expect(logger.logs()[0].log, 'to equal', [1, 2, 3])
})
