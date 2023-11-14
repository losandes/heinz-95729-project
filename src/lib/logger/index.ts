/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable functional/functional-parameters */
/**
 * lots of eslint disabling in this file because it's a logger
 * and typescript doesn't like the console
 * and we're not going to change the console
 * so we're disabling the eslint rules
 * that are complaining about the console
 * (all of the above was generated verbatim by GitHub Copilot :joy:)
 * @fileoverview This is a simple logger that emits events to the console
 * @techdebt - (maybe) Consider replacing this with a central EventEmitter
 * like `npm i @polyn/logger` and/or `npm i events`
 */

import * as R from 'ramda'
import { z } from 'zod'
import env, { LogLevel } from '@lib/env'
import type { Curry } from '@lib/types'

export type WritesLog = (level: LogLevel, event: string, content: any) => Promise<void>

/**
 * Emits an event to the configured destinations (e.g. the console). Does not
 * wait for the event to be emitted. If you need to wait for the event to be
 * emitted, use `publish` instead. For testing purposes, if you pass a
 * function named `resolve` as a property of the `content` argument, it will
 * be called after the event is emitted.
 *
 * @param level - the verbosity level of the event:
 *                'trace' | 'debug' | 'info' | 'warn' | 'error'
 * @param event - a snake_case unique key (string) that concisely
 *                describes the event
 * @param content - any additional information to be logged
 *
 * @returns the results of allSettled for the writers. Potentially retrurns
 *          a curried equivalent of the log.emit function. The curried
 *          function has two unusual capabilities. First, its arguments
 *          needn't be provided one at a time. If f is a ternary function
 *          and g is R.curry(f), the following are equivalent:
 *
 *          ```
 *          g(1)(2)(3)
 *          g(1)(2, 3)
 *          g(1, 2)(3)
 *          g(1, 2, 3)
 *          ```
 * @example the following are equivalent:
 *
 * ```
 * log.emit('info')('unique_key')({ beholdMy: 'stuff' })
 * log.emit('info')('unique_key', { beholdMy: 'stuff' })
 * log.emit('info', 'unique_key')({ beholdMy: 'stuff' })
 * log.emit('info', 'unique_key', { beholdMy: 'stuff' })
 * ```
 *
 * @see https://ramdajs.com/docs/#curry
 * @note ramda actually uses ts-toolbelt for defining curries, but this
 *       approach doesn't appear to satify TS in usage, or at least I can't
 *       figure it out. So I wrote custom Curry types in the index.d.ts.
 *       Toolbelt example follows:
 *
 *       import * as t from 'ts-toolbelt'
 *       export type EmitsLog = t.F.Curry<(level: Level, event: string, ...args: any) => void>
 *       export type EmitsLogForLevel = t.F.Curry<(event: string, ...args: any) => void>
 */
export type PublishesLog = Curry<[LogLevel, string, any], Promise<PromiseSettledResult<void>[]>>

/**
 * Emits an event to the configured destinations (e.g. the console). Does not
 * wait for the event to be emitted. If you need to wait for the event to be
 * emitted, use `publish` instead. For testing purposes, if you pass a
 * function named `__resolve` as a property of the `content` argument, it will
 * be called after the event is emitted.
 *
 * @param level - the verbosity level of the event:
 *                'trace' | 'debug' | 'info' | 'warn' | 'error'
 * @param event - a snake_case unique key (string) that concisely
 *                describes the event
 * @param content - any additional information to be logged
 *
 * @returns content as the final result. Potentially retrurns a curried
 *          equivalent of the log.emit function. The curried function has
 *          two unusual capabilities. First, its arguments needn't be
 *          provided one at a time. If f is a ternary function and g is
 *          R.curry(f), the following are equivalent:
 *
 *          ```
 *          g(1)(2)(3)
 *          g(1)(2, 3)
 *          g(1, 2)(3)
 *          g(1, 2, 3)
 *          ```
 * @example the following are equivalent:
 *
 * ```
 * log.emit('info')('unique_key')({ beholdMy: 'stuff' })
 * log.emit('info')('unique_key', { beholdMy: 'stuff' })
 * log.emit('info', 'unique_key')({ beholdMy: 'stuff' })
 * log.emit('info', 'unique_key', { beholdMy: 'stuff' })
 * ```
 *
 * @see https://ramdajs.com/docs/#curry
 */
export type EmitsLog = Curry<[LogLevel, string, any], any>

/**
 * Emits an event to the configured destinations (e.g. the console). Does not
 * wait for the event to be emitted. If you need to wait for the event to be
 * emitted, use `publish` instead. For testing purposes, if you pass a
 * function named `__resolve` as a property of the `content` argument, it will
 * be called after the event is emitted.
 *
 * @param event - a snake_case unique key (string) that concisely
 *                describes the event
 * @param content - any additional information to be logged
 *
 * @returns content as the final result. Potentially retrurns a curried
 *          equivalent of the log.emit function. The curried function has
 *          two unusual capabilities. First, its arguments needn't be
 *          provided one at a time. If f is a ternary function and g is
 *          R.curry(f), the following are equivalent:
 *
 *          ```
 *          g(1)(2)(3)
 *          g(1)(2, 3)
 *          g(1, 2)(3)
 *          g(1, 2, 3)
 *          ```
 * @example the following are equivalent:
 *
 * ```
 * log.info('unique_key')({ beholdMy: 'stuff' })
 * log.info('unique_key', { beholdMy: 'stuff' })
 * ```
 *
 * @see https://ramdajs.com/docs/#curry
 */
export type EmitsLogForLevel = Curry<[string, any], any>

export type LogEmitter = {
  emit: EmitsLog
  publish: PublishesLog
  trace: EmitsLogForLevel
  debug: EmitsLogForLevel
  info: EmitsLogForLevel
  warn: EmitsLogForLevel
  error: EmitsLogForLevel
}

const LEVEL_EVENT_DELIMITER = '::'

const print = (event: string) => (...args: Readonly<unknown[]>): void => {
  console.log(
    `ERROR${LEVEL_EVENT_DELIMITER}${event}`,
    ...args,
  )
}

/**
 * formats the log args, removing content if it isn't undefined
 */
const format = (level: LogLevel, event: string, content: any) =>
  typeof content !== 'undefined'
    ? [level.toUpperCase(), event, content]
    : [level.toUpperCase(), event]

/**
 * Returns an array of writers that emit events to a destination
 */
const writers = (): WritesLog[] => [
  // eslint-disable-next-line @typescript-eslint/require-await -- the default writer isn't asynchronous, but we want to allow for asynchronous writers
  async (level: LogLevel, event: string, content: any) => {
    const _level = level === 'trace' ? 'debug' : level // trace logs in the console are too noisy

    typeof console[_level] === 'function'
      ? console[_level](...format(level, event, content))
      : console.log(...format(level, event, content))
  },
]

/**
 * The base emitter should be async so we can add listeners that
 * write to a destination asynchronously
 */
const publish = (
  writers: Readonly<WritesLog[]>,
  listeners: Readonly<string[]>,
): PublishesLog => R.curry(async (
  level: LogLevel,
  event: string,
  content: any,
): Promise<PromiseSettledResult<void>[]> => {
  const _level = LogLevel.parse(level)
  const _event = z.string().min(2).parse(event)

  return Promise.allSettled(
    listeners.includes(level)
      ? writers.map(
        async (writer) => {
          await writer(_level, _event, content)
          return content
        },
      )
      : [])
})

const hasResolverForTesting = (content: any) => typeof content !== 'undefined' &&
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  typeof content.__resolve === 'function'

/**
 * The exported emitter should be synchronous because aside from testing,
 * we're not generally waiting for the logs before continuing
 */
const emit = (
  writers: Readonly<WritesLog[]>,
  listeners: Readonly<string[]>,
): EmitsLog => R.curry((
  level: LogLevel,
  event: string,
  content: any,
) => {
  const res = publish(writers, listeners)(level, event, content)
    .catch(print('emit_failed'))

  hasResolverForTesting(content) && res.then(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    content.__resolve('test_complete')
  }).catch(print('emit_resolve_failed'))

  return content
})

/**
 * An EventEmitter that emits events to the console and can
 * be used later to emit events to other destinations
 * @param writers - an array of writers that emit events to a destination
 * @param listeners - an array of log levels that should be emitted
 */
const _logger = (
  writers: Readonly<WritesLog[]>,
  listeners: Readonly<string[]>,
): LogEmitter => ({
  emit: emit(writers, listeners),
  publish: publish(writers, listeners),
  trace: emit(writers, listeners)('trace'),
  debug: emit(writers, listeners)('debug'),
  info: emit(writers, listeners)('info'),
  warn: emit(writers, listeners)('warn'),
  error: emit(writers, listeners)('error'),
})

/**
 *
 */
export const logger = _logger(writers(), env.PUBLIC_LOG_LEVELS)
export const log = logger
export type logger = typeof logger
export default logger

export const forTesting = {
  format,
  _logger,
  writers,
}
