import groupBy from './group-by.js'

/** @type {IDoThingsWithArrays} */
export const withArray = (arr) => {
  return {
    groupBy: (valueProducer) => groupBy(arr, valueProducer),
  }
}

export default { withArray }
