require('dotenv').config();

var express = require('express'),
  // express_cart = require('express'),
  app = express(),
  // app_cart = express_cart(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Product = require('./api/models/productModel'),
  Cart = require('./api/models/cartModel'), //created model loading here
  bodyParser = require('body-parser');

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Shoppingdb'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app_cart.use(bodyParser.urlencoded({ extended: true }));
// app_cart.use(bodyParser.json());
// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });

var routes = require('./api/routes/productRoutes'); //importing route
routes(app); //register the route
var routes_cart = require('./api/routes/cartRoutes'); //importing route
routes_cart(app); //register the route

app.listen(port),
 // app_cart.listen(8000);


console.log('product RESTful API server started on: ' + port); 