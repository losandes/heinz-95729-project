'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var CartSchema = new Schema({
  product_name: {
    type: String,
    required: 'Kindly enter the name of the product',
  },
  shopping_time: {
    type: Date,
    default: Date.now,
  },
  unit_number: {
    type: Number,
    default : 1,
  },
  sub_total: {
    type: Number
  }
});

module.exports = mongoose.model('Cart', CartSchema);