/**
 * @param {Stripe} Stripe
 */
function StripeSessionFactory (deps) {
  'use strict'

  const { stripe } = deps;

  const stripeCheckoutSession = async (ctx) => {
    const logger = ctx.request.state.logger
    const body = ctx.request.body;

    try {
      const lineItems = body.products.map(product => ({
        price_data: {currency: 'usd', product_data: {name: product.title}, unit_amount: parseInt(product.price * 100)},
        quantity: 1,
      }));
      const session = await stripe.checkout.sessions.create({
        success_url: 'http://localhost:3001/checkout/success',
        cancel_url: 'http://localhost:3001/checkout/cancel',
        line_items: lineItems,
        mode: 'payment',
      });

      ctx.response.status = 200
      ctx.response.body = { session };
    } catch (err) {
      logger.emit('Stripe_session_error', 'error', { err })
      throw new Error('Failed to create a stripe checkout session')
    }
  }

  return { stripeCheckoutSession }
}

module.exports = StripeSessionFactory
