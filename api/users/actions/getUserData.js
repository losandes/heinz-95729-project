module.exports.name = 'getUserData'
module.exports.dependencies = ['usersRepo']
module.exports.factory = function (repo) {
  'use strict'

  const getPurchaseHistory = (email) => (resolve, reject) => {
    return repo.getPurchases(email)
      .then(resolve)
      .catch(reject)
  }

  return { getPurchaseHistory }
}
