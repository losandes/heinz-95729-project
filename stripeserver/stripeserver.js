require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors({
  origin: "http://localhost:3001"
}))
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
const restaurantTable = new Map([
  [1,{priceInCents: 10000, restName:"Moti Mahal"}],
  [2,{priceInCents: 20000, restName:"Dover Straits"}],
])
app.post("/reservation-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map( item => {
        const reservationItem = restaurantTable.get(item.id)
        return {
          price_data :{
            currency: 'usd',
            product_data :{
              name: reservationItem.restName
            },
            unit_amount: reservationItem.priceInCents
          },
          quantity: item.quantity
        }
      }

      ),
      success_url: `${process.env.SERVER_URL}/reservationSuccess.html`,
      cancel_url: `${process.env.SERVER_URL}/reservationCancel.html`
    })
    res.json({url : session.url})
  } catch(e) {
    res.status(500).json({error: e.message})
  }
  
})
app.listen(3002)