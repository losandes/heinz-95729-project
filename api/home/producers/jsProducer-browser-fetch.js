module.exports.name = 'producers-jsProducer-browser-fetch'
module.exports.dependencies = ['stringHelper']
module.exports.factory = (stringHelper) => {
  'use strict'

  const BEGIN = '```js\n'
  const TEMPLATE = `fetch('{{url}}', {{options}}).then(function (res) {
  return res.json()
}).then(function (res) {
  console.log(res)
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
      options.mode = 'cors'

      if (config.headers) {
        options.headers = config.headers
      }

      if (config.body) {
        options.body = config.body
      }

      output = TEMPLATE
        .replace(/{{url}}/, stringHelper.getUrl(config))
        .replace(/{{options}}/, JSON.stringify(options, null, 2))

      callback(null, BEGIN + output + END)
    }

    return self
  }
}
