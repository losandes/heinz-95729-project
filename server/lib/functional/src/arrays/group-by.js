/**
 * Groups the items in an array by the value produced
 * by the valueProducer function
 * @param {any[]} arr
 * @param {(result: any) => string} valueProducer
 * @returns {Object.<string, any>}
 */
export const groupArrayItemsBy = (arr, valueProducer) =>
  arr.reduce((mutableResults, result) => {
    const value = valueProducer(result)
    mutableResults[value] = Array.isArray(mutableResults[value])
      ? mutableResults[value]
      : []

    mutableResults[value].push(result)

    return mutableResults
  }, {})

export default groupArrayItemsBy
