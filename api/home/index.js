module.exports = [
  require('./docRenderer.js'),
  require('./homeController.js'),
  require('./mdParser.js'),
  require('./stringHelper.js'),
  require('./producers/curlProducer.js'),
  require('./producers/goProducer.js'),
  require('./producers/jsProducer-browser-fetch.js'),
  require('./producers/jsProducer-node-request.js'),
]
