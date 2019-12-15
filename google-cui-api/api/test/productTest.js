var supertest = require("supertest");
// var should = require("should");
const chai = require('chai');
const should = chai.should();
// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:3000");

// UNIT test begin

describe("Unit test for endpoint regarding product",function(){

  it("if no correct path should return 404 error",function(done){

    // calling home page api
    server
    .get("/")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response

    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(404);
      // res.body.should.be.a('array');
      done();
    });
  });

  // #1 get product should return a list of product
  it("should return list of product",function(done){

    // calling home page api
    server
    .get("/product")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response

    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      res.body.should.be.a('array');
      done();
    });
  });

  it("should return price of apple(which is in database)",function(done){

    // calling home page api
    server
    .get("/product/apple")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response

    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      res.body.should.be.a('Number');
      res.body.should.equal(5);
      done();
    });
  });

  it("should return price of happy(which is not database)",function(done){

    // calling home page api
    server
    .get("/product/happy")
    .expect("Content-type",/json/)
    .expect(200) // THis is HTTP response

    .end(function(err,res){
      // console.log(res.body);
      // HTTP status should be 200
      res.status.should.equal(200);
      res.body.error.should.equal("product not in database");
      done();
    });
  });

});