'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProductSchema = new Schema({
  product_name: {
    type: String,
    required: 'Kindly enter the name of the product',
  },
  product_price: {
    type: Number,
    required: 'Everything needs a price',
  }
});

module.exports = mongoose.model('Product', ProductSchema);

var CartSchema = new Schema({
  product_name: {
    type: String,
    required: 'Kindly enter the name of the product',
  },
  product_price: {
    type: Number,
    required: 'Everything needs a price',
  },
  user_name: {
    type: String,
    required: 'Kindly enter the name of the product',
  },
  shopping_time: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Cart', CartSchema);