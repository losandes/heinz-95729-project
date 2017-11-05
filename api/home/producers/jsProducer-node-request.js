module.exports.name = 'producers-jsProducer-node-request'
module.exports.dependencies = ['stringHelper']
module.exports.factory = (stringHelper) => {
  'use strict'

  const BEGIN = '```node\n'
  const TEMPLATE = `const request = require("request")

request({{options}}, (err, response, body) => {
  if (err) {
    return console.log(err);
  }

  console.log(body);
})
`
  const END = '\n```\n\n'

  return new Producer()

  function Producer () {
    var self = {
      produce: produce
    }

    function produce (config, callback) {
      var options = {}
      var output

      options.method = stringHelper.getMethod(config.method)
      options.url = stringHelper.getUrl(config)

      if (config.headers) {
        options.headers = config.headers
      }

      if (config.body) {
        options.body = config.body
      }

      output = TEMPLATE
        .replace(/{{options}}/, JSON.stringify(options, null, 2))

      callback(null, BEGIN + output + END)
    }

    return self
  }
}
