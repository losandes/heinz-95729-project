module.exports.name = 'checkout'
module.exports.dependencies = ['stripe']
module.exports.factory = function (stripe) {
  'use strict'

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
