const { runner, plan, teardowns } = require('./test-plan')

module.exports = plan
  .then(runner.runTests)
  .then(() => teardowns.forEach((td) => td()))
