const dep = require('../test.js')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
const should = chai.should();
let User;
let usersRepoFactory;
let testUser;
let testUser2;
let repo;
let db;


describe('UserRepo Test Suite', function() {
    before(function(done) {
      // DB dependency required for userRepo
      db = dep.connect();
      db.on('error', (err) => {
        console.log(err)
      });
      db.once('open', function() {
        done()
      });
    
      // compose the dependencies for usersRepo.js
     //User dependency required for userRepo
      User = require('./User.js').factory(dep.blueprint, dep.immutable, 
        dep.mongodb.ObjectID, dep.logger)
      
      //User Repository (Object under test)
      usersRepoFactory = require('./usersRepo').factory
      repo = usersRepoFactory(db, User, dep.blueprint)

      //Sample users to be used for testing
      testUser = {
        "name": "test",
        "email": "test@gmail.com",
        "password": "123456"
      }

      testUser2 = {
        "name": "test",
        "password": "123456"
      }
      
    });

    //Clean up so that each run of the test begins with the same state of db
    after(function() {
      const collection = db.collection('users')
      collection.deleteOne({email: testUser.email}, (err, res) => {
        if (err) {
          console.log(err)
        }
        console.log(`Deleted  ${res.result.n} user record(s) `)
      })
      
    });
  

    describe('Register User', function() {
      it('should register a new user', function() {
      
      return Promise.resolve(repo.create(testUser))
        .then( user => {
          user.ops[0].email.should.equal(testUser.email)
          
        })
      });
    });

    describe('Register User Without Email', function() {
      it('should return a rejected promise', function() {
        return expect(repo.create(testUser2))
          .to.be.rejectedWith('An email is required to create a User');
        
      });
    });

    describe('Register User With Empty Object', function() {
      it('should reject the promise ', function() {
        return expect(repo.create(null))
          .to.be.rejectedWith('A payload is required to create a User');
        
      });
    });

    describe('Get user with email only', function() {
      it('it should reject the promise', function() {
        return expect(repo.get(testUser.email))
          .to.be.rejectedWith('A password is required to get a User');
        
      });
    });

    describe('Get user with password only', function() {
      it('should reject the promise', function() {
        return expect(repo.get(null, testUser.password))
        .to.be.rejectedWith('An email is required to get a User');
        
      });
    });

    describe('Get User With Password and Email', function() {
      it('should satisfy the promise with a user document', function() {
        return repo.get(testUser.email, testUser.password)
          .should.eventually.deep.equal(testUser)
      });
    });

    describe('Get User With Unknown Email and Password', function() {
      it('should satisfy the promise, returning undefined', function() {
        return repo.get('unknown@gmail.com', '123456')
          .should.eventually.deep.equal(undefined)
        
      });
    });

    describe('Get User With UserID', function() {
      it('should satisfy the promise with a user document', function() {
        return repo.getUserById(testUser._id.toString())
          .should.eventually.deep.equal(testUser)
      });
    });

    describe('Get User unknown ID', function() {
      it('should satisfy the promise, returning undefined', function() {
        return repo.getUserById('unknowuserId')
          .should.eventually.equal(undefined)
      });
    });

    describe('Get user without an ID', function() {
      it('should reject the promise', function() {
        return expect(repo.getUserById())
        .to.be.rejectedWith('An ID is required to get a User');
        
      });
    });

    
  });
  