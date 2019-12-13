var mongoose = require('mongoose');

var supertest = require("supertest");
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
// This agent refers to PORT where program is runninng.
chai.use(chaiHttp);

const app = require('../../server.js');
var server = supertest.agent("http://localhost:3000");

var Cart = require('../models/cartModel');

beforeEach(function(done) {
  // console.log(mongoose.connection);
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/Shoppingdb',function(){
      /* Drop the DB */
      mongoose.connection.collections['carts'].drop( function(err) {
        console.log('collection dropped');
      });
  });
  done();
});




// UNIT test begin

describe("Unit test for endpoint regarding cart",function(){

  it("should return list of products in the cart",function(done){

    // it('Returns a 200 response', (done) => {
    chai.request(app)
        .get('/cart')
        .end((error, response) => {
            if (error) done(error);
            console.log("test response");
            console.log(response.body);
            expect(response).to.have.status(200);
            done();
        });
  });


  it('Creates a cart document in our DB', async() => {
    return chai.request(app)
        .post('/cart')
        .send({
            product_name: 'banana',
            unit_number : 3
        })
        .then(async() => {
            // console.log( Cart.find({}));
            return Cart.find();
        })
        .then(async(result) => {
          console.log(result);
            expect(result).to.have.lengthOf(1);

            const cart_result = result[0];
            expect(cart_result.product_name).to.be.equal('banana');
            expect(cart_result.unit_number).to.be.equal(3);
            // expect(cart_result.sub_total).to.be.equal(15);
            // done();/,
        })
});

  it("should add a new item to cart when the cart is empty",function(done){

    
    server
    .post('/cart')
    .send({product_name: "apple",unit_number: 2})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      // console.log(res.body);
      res.status.should.equal(200);
      res.body.product_name.should.equal("apple");
      res.body.unit_number.should.be.a('Number');
      res.body.unit_number.should.equal(2);
      res.body.sub_total.should.be.a('Number');
      res.body.sub_total.should.equal(10)

      done();
    });
  });


after((done) => {
  mongoose.disconnect();
  done();
});

});