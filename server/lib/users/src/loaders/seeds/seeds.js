/** @type {IUsersSeed[]} */
export const seeds = [{
  id: 1678057535644,
  data: [{
    id: 'ul0n6f95erwr7zj7okb07jv4',
    email: 'shopper1@95729.com',
    name: 'Shopper 1',
    timeCreatedMs: 1678057535644,
  }, {
    id: 'e305ui9di19p9vmovezchei1',
    email: 'shopper2@95729.com',
    name: 'Shopper 2',
    timeCreatedMs: 1678057535644,
  }, {
    id: 'hx702lpffagm9nvu2d630zx5',
    email: 'shopper3@95729.com',
    name: 'Shopper 3',
    timeCreatedMs: 1678057535644,
  }, {
    id: 'fihl7o6eqse6nj9nqxv5097n',
    email: 'shopper4@95729.com',
    name: 'Shopper 4',
    timeCreatedMs: 1678057535644,
  }],
}]

/*
 * To add another set of seeds:
 * 1. Open your terminal and navigate to the project directory
 * 2. Type, `node`, and hit enter
 * 3. Type, `Date.now()`, and hit enter
 * 4. Copy the value and use it as values for `id` of the seed and
 *    `timeCreatedMs` of the records you're adding
 * 5. Go back to the terminal and exit node (Ctrl-c x 2)
 * 6. Type, `npx cuid --count 10` (change 10 to the number of ids you
 *    need), and hit enter
 * 8. Copy the ids you generated to use as the ids of the records you're adding
 *
 * Alternatively, in any node package you can:
 * 1. pnpm add -D '@paralleldrive/cuid2'
 * 2. Type, `node`, and hit enter
 * 3. Type, `const { createId } = require('@paralleldrive/cuid2')`,
 *    and hit enter
 * 4. Type, `Array.from(Array(3)).map(() => createId())`, and hit enter
 *    (change the "3" to the number of items you're adding to the seed)
 */

export default seeds
