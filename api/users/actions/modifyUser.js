module.exports.name = 'modifyUser'
module.exports.dependencies = ['usersRepo']
module.exports.factory = function (repo) {
  'use strict'

  const addCategory = (email, category) => (resolve, reject) => {
    return repo.addCategory(email, category)
      .then(resolve)
      .catch(reject)
  }

  const removeCategory = (email, category) => (resolve, reject) => {
    return repo.removeCategory(email, category)
      .then(resolve)
      .catch(reject)
  }

  return { addCategory, removeCategory }
}
