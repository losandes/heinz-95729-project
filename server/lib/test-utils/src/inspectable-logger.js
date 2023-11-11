import { LogEmitter } from '@polyn/logger'

/**
 * @typedef {Object} IState
 * @property {any[]} value
 * @property {(newEntry: any) => IState} push
 */

/**
 * Returns a new array with the given newEntry appended to the
 * previous state. If the resulting array will be greater than
 * the maxLength, it will remove entries from the beginning of
 * the previous state (the oldest state)
 * @curried
 * @param {number} maxLength
 * @returns {(state: any[], value: any) => any[]}
 */
const arrayOfMaxLengthFactory = (maxLength) => (state, newEntry) => {
  return state.length + 1 >= maxLength
    ? [...state.slice((state.length + 1) - maxLength), ...[newEntry]]
    : [...state, ...[newEntry]]
}

/**
 * Creates a state function that will append entries to an
 * array and expose the current state
 * @curried
 * @param {(state: any[], value: any) => any[]} arrayOfMaxLength
 * @returns {(value: any[]) => IState}
 */
const stateFactory = (arrayOfMaxLength) => {
  /**
   * Appends entries to an array and exposes the current state
   * @param {any} initialState
   * @returns {IState}
   */
  const state = (initialState) => {
    return {
      value: initialState,
      push: (newEntry) => state(
        arrayOfMaxLength(initialState, newEntry),
      ),
    }
  }

  return state
}

/**
 * Produces an instance of logger that uses an ArrayWriter
 * which can be inspected
 * @param {number} [maxLength]
 * @param {any} [Logger]
 * @returns {import('@polyn/logger').ILogEmitter & InspectableLogger}
 */
export const makeInspectableLogger = (maxLength = 100, Logger = LogEmitter) => {
  const immutableState = stateFactory(arrayOfMaxLengthFactory(maxLength))
  let state = immutableState([])

  /**
   * @param {any} meta
   * @param  {...any} args
   * @returns
   */
  // eslint-disable-next-line functional/functional-parameters
  const listen = (meta, ...args) => {
    // eslint-disable-next-line functional/immutable-data
    state = state.push({
      log: args.length === 1 ? args[0] : args,
      meta: meta.toObject(),
    })
  }

  const logger = new Logger()

  logger.on('*', listen)

  // eslint-disable-next-line functional/immutable-data, functional/functional-parameters
  logger.logs = () => state.value

  // @ts-ignore
  return logger
}
