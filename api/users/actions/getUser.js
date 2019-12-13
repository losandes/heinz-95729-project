module.exports.name = 'getUser'
module.exports.dependencies = ['usersRepo', 'User']
module.exports.factory = function (repo, User) {
  'use strict'
   

  const getUserByID = (id) => (resolve, reject) => {
   
    return repo.getUserById(id)
      .then(resolve)
      .catch(reject)
  }

  return { getUserByID }
}
