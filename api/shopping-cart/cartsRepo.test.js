const dep = require('../test.js')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
const should = chai.should();
let Cart;
let cartsRepoFactory;
let testCart;
// let testUser2;
let repo;
let db;


describe('CartRepo Test Suite', function () {
  before(function (done) {
    // DB dependency required for cartsRepo
    db = dep.connect();
    db.on('error', (err) => {
      console.log(err)
    });
    db.once('open', function () {
      done()
    });

    // compose the dependencies for cartsRepo.js
    // Cart dependency required for cartsRepo
    Cart = require('./Cart.js').factory(dep.blueprint, dep.immutable, dep.mongodb.ObjectID)

    // Cart Repository (Object under test)
    usersRepoFactory = require('./cartsRepo').factory
    repo = usersRepoFactory(db, Cart, dep.blueprint)

    // Sample carts to be used for testing
    testItem = {
      "name": "new book 11",
      "quantity": 2,
      "price": 20.23,
      "uid": "some_complex_uid3",
      "item_uid": "some_item_uid"
    }

    testItem2 = {
      "name": "new book 12",
      "quantity": 1,
      "price": 10.27,
      "uid": "some_complex_uid3",
      "item_uid": "some_item_uid_12"
    }

    testItem3 = {
      "name": "new book 13",
      "quantity": 1,
      "price": 10.27,
      "uid": 12893,
      "item_uid": "some_item_uid_12"
    }


  });

  // Clean up so that each run of the test begins with the same state of db
  after(function () {
    // // Clean database here
    // const collection = db.collection(Cart.db.collection)
    // // delete cart created
    // collection.deleteOne({ name: testItem.name }, (err, res) => {
    //   if (err) {
    //     console.log(err)
    //   }
    //   console.log(`Delete  ${res.result.n} records `)
    // })
    // db.close()
  });

  beforeEach(function () {
    // runs before each test in this block
  });

  afterEach(function () {
    // runs after each test in this block
  });

  // happy path for creating a cart
  describe('Create cart', function () {
    it('should create a new cart', function () {
      Promise.resolve(repo.create(testItem))
        .then(item => {
          console.log(item)
          item.ops[0].items[0].name.should.equal(testItem.name)
        })
    });
  });

  // negative path for creating a cart
  describe('Create cart with no payload', function () {
    it('it should reject the promise', function () {
      return expect(repo.create())
        .to.be.rejectedWith('A payload is required to create a Cart');
    });
  });

  // happy path for adding a cart
  describe('Add cart', function () {
    it('should add the item to the user\'s cart', function () {
      Promise.resolve(repo.add(testItem2))
        .then(item => {
          console.log(item)
          item.ops[0].items[1].name.should.equal(testItem2.name)
          // user.ops[0].email.should.equal(testUser.email)
        })
    });
  });

  // negative path for adding a cart
  describe('Create cart with no payload', function () {
    it('it should reject the promise', function () {
      return expect(repo.add(testItem3))
        .to.be.rejectedWith('A uid is required to get a Cart');
    });
  });





  //   describe('Register User Without Email', function () {
  //     it('should return a rejected promise', function () {
  //       return expect(repo.create(testUser2))
  //         .to.be.rejectedWith('An email is required to create a User');

  //     });
  //   });

  //   describe('Register User With Empty Object', function () {
  //     it('should reject the promise ', function () {
  //       return expect(repo.create(null))
  //         .to.be.rejectedWith('A payload is required to create a User');

  //     });
  //   });

  //   describe('Get user with email only', function () {
  //     it('it should reject the promise', function () {
  //       return expect(repo.get(testUser.email))
  //         .to.be.rejectedWith('A password is required to get a User');

  //     });
  //   });

  //   describe('Get user with password only', function () {
  //     it('should reject the promise', function () {
  //       return expect(repo.get(null, testUser.password))
  //         .to.be.rejectedWith('An email is required to get a User');

  //     });
  //   });

  //   describe('Get User With Password and Email', function () {
  //     it('should satisfy the promise with a user document', function () {
  //       return repo.get(testUser.email, testUser.password)
  //         .should.eventually.deep.equal(testUser)

  //     });
  //   });

  //   describe('Get User With Unknown Email and Password', function () {
  //     it('should satisfy the promise, returning undefined', function () {
  //       return repo.get('unknown@gmail.com', '123456')
  //         .should.eventually.deep.equal(undefined)

  //     });
  //   });

  //   describe('Get User With UserID', function () {
  //     it('should satisfy the promise with a user document', function () {
  //       return repo.getUserById(testUser._id.toString())
  //         .should.eventually.deep.equal(testUser)
  //     });
  //   });

  //   describe('Get unknown ID', function () {
  //     it('should satisfy the promise, returning undefined', function () {
  //       return repo.getUserById('unknowuserId')
  //         .should.eventually.deep.equal(undefined)
  //     });
  //   });

  //   describe('Get user without an ID', function () {
  //     it('should reject the promise', function () {
  //       return expect(repo.getUserById())
  //         .to.be.rejectedWith('An ID is required to get a User');

  //     });
  //   });
});
