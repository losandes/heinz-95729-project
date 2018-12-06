// Refered to the video https://www.youtube.com/watch?v=FhBtM70QZKM
// https://stripe.com/docs/stripe-js/elements/quickstart
var express = require('express')
var stripe = require('stripe')('sk_test_tjoHHaJQvf1Y4CoAEpWBWr0w')
var bodyParser = require('body-parser')
var hbs = require('hbs')

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))


app.get('/paysucess', function (req, res) {
  res.render('paysucess', { })
})


app.post('/charge', function (req, res) {
  var token = req.body.stripeToken
  var chargeAmount = req.body.chargeAmount
  var charge = stripe.charges.create({
    amount: chargeAmount,
    currency: 'usd',
    source: token
  // eslint-disable-next-line handle-callback-err
  }, function (err, charge) {
    if (err & err.type === 'StripeCardError') {
      console.log('Your card was declined')
    }
  })
  console.log('Your payment was successful!')
  res.redirect('/paysuccess')
})




