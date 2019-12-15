module.exports.name = 'array-logger'
module.exports.singleton = true
module.exports.dependencies = []
module.exports.factory = () => {
  const logs = []
  const log = (level) => (...log) => {
    logs.push({ level, log })
  }

  return {
    debug: log('debug'),
    trace: log('trace'),
    info: log('info'),
    warn: log('warn'),
    error: log('error'),
    fatal: log('fatal'),
    getLogs: () => logs
  }
}

