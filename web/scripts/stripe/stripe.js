/*
sk key : sk_test_tjoHHaJQvf1Y4CoAEpWBWr0w
publish key :pk_test_4VicAuG5Ou9zuqA4LVIRI0dC
 from stripe.com

*/
// Refered to the video https://www.youtube.com/watch?v=FhBtM70QZKM
// https://stripe.com/docs/stripe-js/elements/quickstart
// npm install stripe
// installing body parser
// $ npm install body-parser
// API

// npm install express

// install hbs
// npm install hbs

var express = require('express')
var stripe = require('stripe')('sk_test_tjoHHaJQvf1Y4CoAEpWBWr0w')
var bodyParser = require('body-parser')
var hbs = require('hbs')

var app = express()

app.set('view engine', 'hbs')
// eslint-disable-next-line no-path-concat
app.set('views', __dirname + '/views')
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

// app.listen(3000, function () {
//   console.log('Stripe is running')
// })




