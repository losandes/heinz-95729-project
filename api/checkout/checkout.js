module.exports.name = 'checkout'
module.exports.dependencies = ['usersRepo']
module.exports.factory = function (repo) {
  'use strict'

  var stripe = require('stripe')('sk_test_msbYVDiCFgtNQsqZCZqnckYf')

  /* const register = (body) => (resolve, reject) => {
    return repo.create(body)
      .then(resolve)
      .catch(reject)
  } */

  const charge = (checkoutInfo, curDate) => (resolve, reject) => {
    return stripe.charges.create({
      amount: checkoutInfo.total,
      currency: 'usd',
      description: `User with email ${checkoutInfo.email} made a purchase at ${curDate}`,
      source: checkoutInfo.tokenID
    }).then(resolve)
      .catch(reject)
  }

  return { charge }
}
