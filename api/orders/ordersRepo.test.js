const dep = require('../test.js')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();
const assert = chai.assert;
let Order;
let Cart;
let ordersRepoFactory;
let testOrder;
let repo;
let db;
let orderID;

describe('OrderRepo Test Suite', function() {
    before(function(done) {
     
      db = dep.connect();
      db.on('error', (err) => {
        console.log(err)
      });
      db.once('open', function() {
        done()
      });
    
      Cart = require('../shopping-cart/Cart.js').factory(dep.blueprint, dep.immutable, dep.mongodb.ObjectID)
      Order = require('./Order.js').factory(dep.blueprint, dep.immutable, Cart)
      
      //User Repository (Object under test)
      ordersRepoFactory = require('./ordersRepo').factory
      repo = ordersRepoFactory(db, Order, dep.blueprint, dep.mongodb)
      
      testOrder = {
        "_id": "5dedc8c29d45c73267c999c4",
        "uid":"564d420206fd376a5b560028",
        "total":17.54,
        "items":[
          {
            "name":"One Last Thing Before I Go",
            "quantity":2,
            "price":8.77,
            "item_uid":"before_go",
            "downloads":9
          }
        ],
      }
    });

    //Clean up so that each run of the test begins with the same state of db
    after(function() {
      //Clean database here
      const collection = db.collection('orders')
      collection.deleteOne({uid: testOrder.uid}, (err, res) => {
        if (err) {
          console.log(err)
        }
        console.log(`Deleted  ${res.result.n} order record(s) `)
      })
       
    });
  
    describe('Create Order', function() {
      it('should satisfy the promise returning a document', function() {
        return Promise.resolve(repo.add(testOrder))
        .then( order => {
          orderID = order.ops[0]._id
          expect(order.ops[0].uid).to.deep.equal(testOrder.uid)
        })
        
      });
    });

    describe('Create order with no payload', function() {
      it('should return a rejected promise', function() {
        return expect(repo.add(null))
          .to.be.rejectedWith('A payload is required to add an order');
      });
    });

    describe('Get Order Without User ID', function() {
      it('it should reject the promise', function() {
        return expect(repo.get(null))
          .to.be.rejectedWith('A uid is required to get orders');
        
      });
    });

    describe('Get User Orders with UID', function() {
      it('should satisfy the promise with orders', function() {
        return Promise.resolve(repo.get(testOrder.uid))
        .then( orders => {
            expect(orders[0].items).to.deep.equal(testOrder.items)
        })
      });
    });

    describe('Get User Order Total Cost', function() {
      it('should satisfy the promise with correct order total cost', function() {
        return Promise.resolve(repo.get(testOrder.uid))
        .then( orders => {
            expect(orders[0].total).to.deep.equal(testOrder.total)
        })
      });
    });

    describe('Get Order With Unknown UID', function() {
      it('should satisfy the promise, returning empty array', function() {
        return repo.get('unknownuid')
          .should.eventually.deep.equal(Array())
        
      });
    });

    describe('Get Order With Unknown ID', function() {
      it('should satisfy the promise, returning undefined', function() {
        return repo.getOne(testOrder._id)
          .should.eventually.deep.equal(undefined)
      });
    });

    describe('Get Order Without ID', function() {
      it('should reject the promise', function() {
        return expect(repo.getOne())
        .to.be.rejectedWith('A uid is required to get an order');
      });
    });

    describe('Get Order With  UID', function() {
      it('should satisfy the promise, returning order document', function() {
        return Promise.resolve(repo.getOne(orderID.toString()))
        .then( order => {
          
            expect(order.items).to.deep.equal(testOrder.items)
        })
      });
    });

    describe('Reduce Item download Quantity', function() {
      it('should satisfy the promise, returning order document', function() {
        return Promise.resolve(repo.reduceDownloadQuantity(orderID.toString(), testOrder.items[0].item_uid))
        .then( result => {
            expect(result.modifiedCount).to.deep.equal(1)
        })
      });
    });

    describe('Check Amount of Downloads Remaining', function() {
      it('should satisfy the promise, returning order 8 download for item one', function() {
        return Promise.resolve(repo.getOne(orderID.toString()))
        .then( order => {
            expect(order.items[0].downloads).to.deep.equal(8)
        })
      });
    });
  });
  