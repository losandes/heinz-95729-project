var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  Product = require('./api/models/productModel'), //created model loading here
  bodyParser = require('body-parser');
  
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/Shoppingdb'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });

var routes = require('./api/routes/productRoutes'); //importing route
routes(app); //register the route


app.listen(port);


console.log('product RESTful API server started on: ' + port);