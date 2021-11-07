const fs = require('fs')
const path = require('path')
const ignoreExpression = /node_modules/i
const walkOneSync = (dir) =>
  fs.readdirSync(dir).reduce((files, file) => {
    if (ignoreExpression.test(file)) {
      return files
    }

    const name = path.join(dir, file)
    const isDirectory = fs.statSync(name).isDirectory()
    return isDirectory ? [...files, ...walkOneSync(name)] : [...files, name]
  }, [])

const walkSync = (dirs) => {
  return dirs.reduce((files, dir) => {
    walkOneSync(dir).forEach((file) => files.push(file))
    return files
  }, [])
}

module.exports = {
  walkSync,
  ignoreExpression,
}
