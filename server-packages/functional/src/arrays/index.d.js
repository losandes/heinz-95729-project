/**
 * Groups the items in an array by the value produced
 * by the valueProducer function
 * @callback IGroupArrayItemsBy
 * @param {(result: any) => string} valueProducer
 * @returns {Object.<string, any>}
 */

/**
 * @callback IDoThingsWithArrays
 * @param {any[]} arr
 * @returns {{
 *   groupBy: IGroupArrayItemsBy
 * }}
 */
