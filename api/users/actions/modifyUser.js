module.exports.name = 'modifyUser'
module.exports.dependencies = ['usersRepo']
module.exports.factory = function (repo) {
  'use strict'

  const addCategory = (email, category) => (resolve, reject) => {
    // TODO: make sure the properties we need are here
    return repo.addCategory(email, category)
      .then(resolve)
      .catch(reject)
  }

  return { addCategory }
}
