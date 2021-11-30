const expect = require('unexpected')
const supposed = require('supposed')
const { walkSync } = require('./find-projects.js')

const testFileNameExpression = /test-plan.js$/i
const finalPlan = new Promise((resolve, reject) => {
  try {
    const onePlan = walkSync(['./src']) // find test-plan files
      .filter((file) => testFileNameExpression.test(file))
      .map((file) => require(`./${file}`)) // load the plans
      .reduce(async (plans, testPlan) => { // merge them into 1 plan
        const { plan } = testPlan
        const output = await plans
        const current = (await plan).plan

        if (!current) {
          return output
        }

        output.plan.count += current.count
        current.batches.forEach((batch) => output.plan.batches.push(batch))
        current.order.forEach((id) => output.plan.order.push(id))

        if (Array.isArray(testPlan.teardowns)) {
          testPlan.teardowns.forEach((td) => output.plan.teardowns.push(td))
        }

        return output
      }, Promise.resolve({
        plan: {
          count: 0,
          completed: 0,
          batches: [],
          order: [],
          teardowns: [],
        },
      }))

    resolve(onePlan)
  } catch (e) {
    reject(e)
  }
})

module.exports = finalPlan.then((plan) => // run the aggregate plan
  supposed.Suite({
    name: 'sample-slack',
    assertionLibrary: expect,
  })
    .runner()
    .runTests(plan)
    .then(() => plan.plan.teardowns.forEach(async (teardown) => teardown())),
)
