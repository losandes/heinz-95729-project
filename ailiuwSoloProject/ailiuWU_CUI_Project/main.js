/**Require adventure*/
const Adventure = require('terminal-adventure').Adventure
/**Require dialogFlow api*/
const apiai = require('apiai')
/**Require sprintf*/
const sprintf=require("sprintf-js").sprintf
/**Load grocercy product data*/
const fs = require("fs")
const Market=require('./Market')

new Market(Adventure,apiai,sprintf,fs)