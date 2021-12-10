require("dotenv").config()

const express = require("express")
const app = express()
const cors = require("cors")
app.use(express.json())
app.use(
  cors({
  origin: "http://localhost:3001",
  })
)
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
const storeItems = new Map([
  ["37173d29-21aa-4243-a0ea-a4b56e47aea6", {priceInCents: 1274, name: "Tibetan Peach Pie: A True Account of an Imaginative Life"}],
  ["455ce3e4-ccbf-4a57-850a-fce7a6b87561", {priceInCents: 3216, name: "Dependency Injection in .NET"}],
  ["4cfae534-a33d-4860-9ab9-5d18500bd89e", {priceInCents: 999, name: "Swamplandia"}],
  ["5672996f-114c-4365-ab29-19faf44da643", {priceInCents: 459, name: "The Hitchhiker's Guide to the Galaxy"}],
  ["59fe912e-c191-45ee-846c-74dbce92e7a1", {priceInCents: 941, name: "Wild Ducks Flying Backward"}],
  ["618fc4ef-c2a2-463d-b4d6-68b56fa4d920", {priceInCents: 977, name: "A Visit From the Goon Squad"}],
  ["72e9454e-c7bf-4d53-b47c-325a4cef713a", {priceInCents: 683, name: "The Restaurant at the End of the Universe"}],
  ["748fb8be-ae3f-449d-bdb0-fd8f6f67d1db", {priceInCents: 299, name: "The Four Gifts"}],
  ["80fab41b-84e6-4524-97a9-06c97b3b93fd", {priceInCents: 599, name: "Life, the Universe and Everything"}],
  ["891366fd-906b-47b6-b90b-27e5017a355e", {priceInCents: 1184, name: "The Rise & Fall of Great Powers: A Novel"}],
  ["97b13851-3404-4497-ad5c-9dbdff6cb1e6", {priceInCents: 799, name: "This Is Where I Leave You: A Novel"}],
  ["9e6939e4-045b-4eaf-b666-e5458cbbac4b", {priceInCents: 862, name: "The White Tiger: A Novel"}],
  ["d8fb34ca-6046-4647-98fe-68961ce89a1d", {priceInCents: 683, name: "Dirk Gently's Holistic Detective Agency"}],
  ["e3165800-0593-4c58-8838-5db004c6ba74", {priceInCents: 899, name: "Half of a Yellow Sun"}],
  ["e8fc3370-13a0-4926-a471-105d99daf28c", {priceInCents: 99, name: "Siddhartha"}],
  ["ea11598e-fd25-4430-ac16-19b6aeffa947", {priceInCents: 1299, name: "The Bend of the World: A Novel"}],
])

app.post("/create-checkout-session", async(req,res)=>{
  console.log(req.body.pid)
  console.log(req.body.price)
  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: req.body.items.map(item => {
        const storeItem = storeItems.get(item)
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: storeItem.name
            },
            unit_amount: storeItem.priceInCents
          },
          quantity: 1
        }
      }),
      success_url: `${process.env.CLIENT_URL}/success/${req.body.pid}/${req.body.price}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
    })
    res.json({url: session.url})
  }
  catch(e){
    res.status(500).json({error: e.message})
  }
})

app.listen(3002)
console.log('The app is running at http://localhost:3002')