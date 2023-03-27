import test from 'supposed'
import expect from 'unexpected'
import { withArray } from '@heinz-95729/functional'

const givenWithArr = '@heinz-95729/functional withArray'

test([givenWithArr, 'when an array is grouped by a string value',
  'it should include a logs property from which logs can be inspected'].join(', '),
async () => {
  const inventory = [
    { name: 'asparagus', type: 'vegetables', quantity: 5 },
    { name: 'bananas', type: 'fruit', quantity: 0 },
    { name: 'goat', type: 'meat', quantity: 23 },
    { name: 'cherries', type: 'fruit', quantity: 5 },
    { name: 'fish', type: 'meat', quantity: 22 },
  ]

  const result = withArray(inventory)
    .groupBy(({ type }) => type)

  expect(result, 'to satisfy', {
    vegetables: [
      { name: 'asparagus', type: 'vegetables', quantity: 5 },
    ],
    fruit: [
      { name: 'bananas', type: 'fruit', quantity: 0 },
      { name: 'cherries', type: 'fruit', quantity: 5 },
    ],
    meat: [
      { name: 'goat', type: 'meat', quantity: 23 },
      { name: 'fish', type: 'meat', quantity: 22 },
    ],
  })
})
