/* eslint-disable functional/no-let */
import { sleep } from './sleep.js'

/**
 * Executes an async function once and makes the result
 * usable over and over again. Meant to be used similar
 * to a beforeAll in tests
 * @param {() => Promise<any>} func - a func that produces a result that will be used by all callers
 * @param {number} timeoutMs - maximum milliseconds to wait for a the func to produce a result
 * @returns {{ getResult: (timeRunningMs?: number, timeBetweenTries?: number) => Promise<any> }}
 */
export default function (func, timeoutMs = 2000) {
  /** @type {Error} */
  let err
  let ran = false
  let running = false
  /** @type {any} */
  let res

  const getFirstResult = () => new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      running = false
      ran = true
      err = new Error('timeout!')
      reject(err)
    }, timeoutMs)

    func()
      .then((value) => {
        res = value
        resolve(value)
      })
      .catch((error) => {
        err = error
        reject(err)
      })
      .finally(() => {
        clearTimeout(timer)
        running = false
        ran = true
      })
  })

  /**
   * @param {number} timeRunningMs - Milliseconds elapsed since this
   *   function was first called. While this could be thwarted by
   *   a caller that always sets it to zero (don't do that!), it
   *   is intended to be a concurrent-safe way of asking multiple
   *   concurrent callers to wait for a single caller's request
   *   to instantiate the object to complete.
   * @param {number} timeBetweenTries - Milliseconds to wait before
   *   the next time we check if a value has been produced yet
   * @returns {Promise<any>}
   */
  const getResult = async (timeRunningMs = 0, timeBetweenTries = 30) => {
    if (err) {
      throw err
    } else if (ran) {
      return res
    } else if (running && timeRunningMs < timeoutMs) {
      await sleep(timeBetweenTries)
      return getResult(timeRunningMs + timeBetweenTries)
    } else {
      running = true
      return getFirstResult()
    }
  }

  return { getResult }
}
