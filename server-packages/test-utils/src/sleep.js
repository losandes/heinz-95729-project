/**
 * Await this function to stop procesing for approximately
 * the milliseconds you provide
 * @param {number} ms the milliseconds to await
 * @returns
 */
export const sleep = (/** @type {number} */ ms) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export default sleep
