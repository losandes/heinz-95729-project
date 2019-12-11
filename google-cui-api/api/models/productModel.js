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