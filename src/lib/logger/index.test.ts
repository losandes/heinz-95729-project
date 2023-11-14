/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { resolve } from 'path'
import { test, type ExpectStatic } from 'vitest'
import type { LogLevel } from '@lib/env'
import { forTesting } from './index'

const given = 'given logger::logger'
const {
  format,
  _logger,
} = forTesting

const arrayWriter = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const arr: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/require-await
  const write = async (level: LogLevel, event: string, content: any) => {
    // eslint-disable-next-line functional/immutable-data
    arr.push({ level, event, content })
  }
  return { arr, write }
}

test.concurrent([given,
  'when logger.publish is called with a level that is included in listeners',
  'it should call all writers with the level, event, and content',
].join(', '), async ({ expect }) => {
  // given
  const w1 = arrayWriter()
  const w2 = arrayWriter()
  const expected = {
    level: 'info' as LogLevel,
    event: 'test_event',
    content: { beholdMy: 'stuff' },
  }
  const logger = _logger([w1.write, w2.write], ['info', 'error'])

  // when
  const actual = [
    await logger.publish(expected.level)(expected.event)(expected.content),
    await logger.publish(expected.level)(expected.event, expected.content),
    await logger.publish(expected.level, expected.event)(expected.content),
    await logger.publish(expected.level, expected.event, expected.content),
  ]

  // then
  actual.forEach((res, idx) => {
    expect(res[0]?.status).to.equal('fulfilled')
    expect(res[1]?.status).to.equal('fulfilled')
    expect(w1.arr[idx]).to.include(expected)
    expect(w2.arr[idx]).to.include(expected)
  })
})

test.concurrent([given,
  'when logger.emit is called with a level that is included in listeners',
  'it should call all writers with the level, event, and content',
].join(', '), async ({ expect }) => {
  // given
  const w1 = arrayWriter()
  const w2 = arrayWriter()
  const expected = {
    level: 'info' as LogLevel,
    event: 'test_event',
  }
  const content = { beholdMy: 'stuff' }
  const logger = _logger([w1.write, w2.write], ['info', 'error'])

  // when
  const actual = [
    await new Promise((resolve) => {
      logger.emit(expected.level)(expected.event)({
        ...content,
        ...{ __resolve: resolve },
      })
    }),
    await new Promise((resolve) => {
      logger.emit(expected.level)(expected.event, {
        ...content,
        ...{ __resolve: resolve },
      })
    }),
    await new Promise((resolve) => {
      logger.emit(expected.level, expected.event)({
        ...content,
        ...{ __resolve: resolve },
      })
    }),
    await new Promise((resolve) => {
      logger.emit(expected.level, expected.event, {
        ...content,
        ...{ __resolve: resolve },
      })
    }),
  ]

  // then
  actual.forEach((_res, idx) => {
    expect(w1.arr[idx]).to.include(expected)
    expect(w1.arr[idx].content).to.include(content)
    expect(w2.arr[idx]).to.include(expected)
    expect(w2.arr[idx].content).to.include(content)
  })
})

test.concurrent([given,
  'when logger.emit is called with a level that is NOT included in listeners',
  'it should NOT call any writers',
].join(', '), async ({ expect }) => {
  // given
  const w1 = arrayWriter()
  const w2 = arrayWriter()
  const expected = {
    level: 'trace' as LogLevel,
    event: 'test_event',
  }
  const content = { beholdMy: 'stuff' }
  const logger = _logger([w1.write, w2.write], ['info', 'error'])

  // when
  await new Promise((resolve) => {
    logger.emit(expected.level)(expected.event)({
      ...content,
      ...{ __resolve: resolve },
    })
  })

  expect(w1.arr.length).to.equal(0)
  expect(w2.arr.length).to.equal(0)
})

test.concurrent([given,
  'when logger.emit is called',
  'it should return the content',
].join(', '), ({ expect }) => {
  // given
  const w1 = arrayWriter()
  const w2 = arrayWriter()
  const expected = {
    level: 'info' as LogLevel,
    event: 'test_event',
  }
  const content = { beholdMy: 'stuff' }
  const logger = _logger([w1.write, w2.write], ['info', 'error'])

  // when
  const actual = [
    logger.emit(expected.level)(expected.event)({
      ...content,
      ...{ __resolve: resolve },
    }),
    logger.emit(expected.level)(expected.event, {
      ...content,
      ...{ __resolve: resolve },
    }),
    logger.emit(expected.level, expected.event)({
      ...content,
      ...{ __resolve: resolve },
    }),
    logger.emit(expected.level, expected.event, {
      ...content,
      ...{ __resolve: resolve },
    }),
  ]

  // then
  actual.forEach((res) => {
    expect(res).to.include(content)
    expect(res).to.include(content)
  })
})

const testEmitsForLevel = (level: LogLevel) =>
  async ({ expect }: Readonly<{ expect: ExpectStatic }>) => {
  // given
    const w1 = arrayWriter()
    const w2 = arrayWriter()
    const expected = {
      level,
      event: 'test_event',
    }
    const content = { beholdMy: 'stuff' }
    const logger = _logger([w1.write, w2.write], ['trace', 'debug', 'info', 'warn', 'error'])

    // when
    const actual = [
      await new Promise((resolve) => {
        logger[level](expected.event)({
          ...content,
          ...{ __resolve: resolve },
        })
      }),
      await new Promise((resolve) => {
        logger[level](expected.event, {
          ...content,
          ...{ __resolve: resolve },
        })
      }),
      await new Promise((resolve) => {
        logger[level](expected.event)({
          ...content,
          ...{ __resolve: resolve },
        })
      }),
      await new Promise((resolve) => {
        logger[level](expected.event, {
          ...content,
          ...{ __resolve: resolve },
        })
      }),
    ]

    // then
    actual.forEach((_res, idx) => {
      expect(w1.arr[idx]).to.include(expected)
      expect(w1.arr[idx].content).to.include(content)
      expect(w2.arr[idx]).to.include(expected)
      expect(w2.arr[idx].content).to.include(content)
    })
  }

test.concurrent([given,
  'when logger.trace, debug, info, warn, or error are called',
  'it should call all writers with the level, event, and args',
].join(', '), async ({ expect }) => {
  await testEmitsForLevel('trace')({ expect })
  await testEmitsForLevel('debug')({ expect })
  await testEmitsForLevel('info')({ expect })
  await testEmitsForLevel('warn')({ expect })
  await testEmitsForLevel('error')({ expect })
})

test.concurrent([given,
  'when logger.trace, debug, info, or warn are passed to a then',
  'it should call the writers and pass the result to the next step',
].join(', '), async ({ expect }) => {
  // given
  const w1 = arrayWriter()
  const w2 = arrayWriter()
  const expected = {
    level: 'info' as LogLevel,
    event: 'test_event',
  }
  const content = { beholdMy: 'stuff' }
  const logger = _logger([w1.write, w2.write], ['info', 'error'])

  // when
  await Promise.resolve((content))
    .then(logger.info(expected.event))
    .then((res) => {
      expect(res).to.include(content)
      expect(w1.arr[0]).to.include(expected)
      expect(w1.arr[0].content).to.include(content)
      expect(w2.arr[0]).to.include(expected)
      expect(w2.arr[0].content).to.include(content)
    })
})

test.concurrent([given,
  'when logger.error is passed to a catch',
  'it should call the writers',
].join(', '), async ({ expect }) => {
  // given
  const w1 = arrayWriter()
  const w2 = arrayWriter()
  const expected = {
    level: 'error' as LogLevel,
    event: 'test_event_failed',
  }
  const err = new Error('Boom!')
  const logger = _logger([w1.write, w2.write], ['info', 'error'])

  // when
  await Promise.reject(err)
    .then(logger.info(expected.event))
    .catch(logger.error(expected.event))
    .then(() => {
      expect(w1.arr[0]).to.include(expected)
      expect(w1.arr[0].content).to.equal(err)
      expect(w2.arr[0]).to.include(expected)
      expect(w2.arr[0].content).to.equal(err)
    })
})

test.concurrent([given,
  'when format is called with _defined_ content',
  'it should return an array with level, event, and content',
].join(', '), ({ expect }) => {
  // given
  const level = 'info'
  const event = 'test'
  const content = 'test content'

  // when
  const result = format(level, event, content)

  // then
  expect(result).toEqual([level.toUpperCase(), event, content])
})

test.concurrent([given,
  'when format is called with _undefined_ content',
  'it should return an array with level and event',
].join(', '), ({ expect }) => {
  // given
  const level = 'info'
  const event = 'test'

  // when
  const result = format(level, event, undefined)

  // then
  expect(result).toEqual([level.toUpperCase(), event])
})

test.concurrent([given,
  'when format is called with _null_ content',
  'it should return an array with level, event, and null',
].join(', '), ({ expect }) => {
  // given
  const level = 'info'
  const event = 'test'
  const content = null

  // when
  const result = format(level, event, content)

  // then
  expect(result).toEqual([level.toUpperCase(), event, content])
})

test.concurrent([given, 'when format is called',
  'and level is undefined,',
  'it should throw an error',
].join(', '), ({ expect }) => {
  // given
  const level = undefined
  const event = 'test'
  const content = 'test content'

  // when, then
  // @ts-expect-error -- this tests a negative path
  expect(() => format(level, event, content)).toThrow()
})
