module.exports = {
  scope: 'heinz',
  name: 'checkoutRepo',
  dependencies: ['Repo'],
  factory: (Repo) => {
    'use strict'

    const repo = new Repo()

    const charge = (checkout, callback) => {
      const email = checkout.email
      repo.post({
        path: `/checkout/${email}`,
        body: { checkout }
      }, callback)
    }

    return { charge }
  }
}
