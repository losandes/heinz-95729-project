module.exports = {
  scope: 'heinz',
  name: 'Checkout',
  factory: () => {
    'use strict'

    return function Checkout (purchaseInfo) {
      const self = {
        email: purchaseInfo.email,
        tokenID: purchaseInfo.tokenID,
        total: convertToCents(purchaseInfo.total),
        products: purchaseInfo.products
      }

      return self
    }

    /**
     * This function converts '6.99' into the integer 699. This is done as stripe
     * expects the payment amount in cents.
     *
     * @param amount - String representation of the amount
     */
    function convertToCents (amount) {
      amount = amount.replace('.', '')
      return parseInt(amount)
    }
  }
}
