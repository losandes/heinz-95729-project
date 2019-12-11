const dep = require('../test.js')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
const should = chai.should();
let Order;
let ordersRepoFactory;
let testOrder;
let testOrder2;
let repo;
let db;


describe('OrderRepo Test Suite', function () {
  before(function (done) {
    // DB dependency required for ordersRepo
    db = dep.connect();
    db.on('error', (err) => {
      console.log(err)
    });
    db.once('open', function () {
      done()
    });

    

    // Compose the dependencies for ordersRepo.js
    // Cart dependency required for ordersRepo
    Cart = require('../shopping-cart/Cart.js').factory(dep.blueprint, dep.immutable,
      dep.mongodb.ObjectID)
    // Order dependency required for ordersRepo
    Order = require('./Order.js').factory(dep.blueprint, dep.immutable, Cart)
    
    // Order Repository (Object under test)
    ordersRepoFactory = require('./ordersRepo').factory
    repo = ordersRepoFactory(db, Order, dep.blueprint, dep.mongodb)

    // Sample orders to be used for testing
    testOrder = {
      "uid": "some_complex_uid3",
      "total": "80.92",
      "items": [
        {
          "name": "new book 11",
          "quantity": 2,
          "price": 20.23,
          "item_uid": "some_item_uid_63"
        },
        {
          "name": "new book 11",
          "quantity": 2,
          "price": 20.23,
          "item_uid": "some_item_uid"
        }
      ]
    }


    // testOrder2 = {
    //   "name": "test",
    //   "password": "123456"
    // }

  });

  //Clean up so that each run of the test begins with the same state of db
  after(function () {
    // Clean database here
    const collection = db.collection(Order.db.collection)
    
    // delete order created
    collection.deleteOne({ uid: "some_complex_uid3" }, (err, res) => {
      if (err) {
        console.log(err)
      }
      console.log(`Delete  ${res.result.n} records `)
    })
    db.close()
  });

  beforeEach(function () {
    // runs before each test in this block
  });

  afterEach(function () {
    // runs after each test in this block
  });

  describe('Add an order', function () {
    it('should add an order to database', function () {
      Promise.resolve(repo.add(testOrder))
        .then(order => {
          console.log(order.ops[0])
          order.ops[0].uid.should.equal(testOrder.uid)
        })
    });
  });

  // describe('Register User Without Email', function () {
  //   it('should return a rejected promise', function () {
  //     return expect(repo.create(testUser2))
  //       .to.be.rejectedWith('An email is required to create a User');

  //   });
  // });

  // describe('Register User With Empty Object', function () {
  //   it('should reject the promise ', function () {
  //     return expect(repo.create(null))
  //       .to.be.rejectedWith('A payload is required to create a User');

  //   });
  // });

  // describe('Get user with email only', function () {
  //   it('it should reject the promise', function () {
  //     return expect(repo.get(testUser.email))
  //       .to.be.rejectedWith('A password is required to get a User');

  //   });
  // });

  // describe('Get user with password only', function () {
  //   it('should reject the promise', function () {
  //     return expect(repo.get(null, testUser.password))
  //       .to.be.rejectedWith('An email is required to get a User');

  //   });
  // });

  // describe('Get User With Password and Email', function () {
  //   it('should satisfy the promise with a user document', function () {
  //     return repo.get(testUser.email, testUser.password)
  //       .should.eventually.deep.equal(testUser)

  //   });
  // });

  // describe('Get User With Unknown Email and Password', function () {
  //   it('should satisfy the promise, returning undefined', function () {
  //     return repo.get('unknown@gmail.com', '123456')
  //       .should.eventually.deep.equal(undefined)

  //   });
  // });

  // describe('Get User With UserID', function () {
  //   it('should satisfy the promise with a user document', function () {
  //     return repo.getUserById(testUser._id.toString())
  //       .should.eventually.deep.equal(testUser)
  //   });
  // });

  // describe('Get unknown ID', function () {
  //   it('should satisfy the promise, returning undefined', function () {
  //     return repo.getUserById('unknowuserId')
  //       .should.eventually.deep.equal(undefined)
  //   });
  // });

  // describe('Get user without an ID', function () {
  //   it('should reject the promise', function () {
  //     return expect(repo.getUserById())
  //       .to.be.rejectedWith('An ID is required to get a User');

  //   });
  // });
});
