const dep = require('../test.js')
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
const should = chai.should();
let Product;
let productsRepoFactory;
let testProduct;
let repo;
let db;
let testOptions;
let emptySearchOptions;
let numOfResultOptions;


describe('ProductRepo Test Suite', function () {
    before(function (done) {
        // DB dependency required for userRepo
        db = dep.connect();
        db.on('error', (err) => {
            console.log(err)
        });
        db.once('open', function () {
            done()
        });

        // compose the dependencies for usersRepo.js
        //User dependency required for userRepo
        Product = require('./Product.js').factory(dep.blueprint, dep.immutable,
            dep.mongodb.ObjectID, dep.logger)

        //User Repository (Object under test)
        productsRepoFactory = require('./productsRepo').factory
        repo = productsRepoFactory(db, Product, dep.blueprint, dep.immutable)

        //Sample users to be used for testing
        testProduct = {
            "_id": "5623c1263b952eb796d79dfc",
            "uid": "hitchhikers_guide_galaxy",
            "title": "The Hitchhiker's Guide to the Galaxy",
            "description": "Seconds before the Earth is demolished to make way for a galactic freeway, Arthur Dent is plucked off the planet by his friend Ford Prefect, a researcher for the revised edition of The Hitchhiker's Guide to the Galaxy who, for the last fifteen years, has been posing as an out-of-work actor. Together this dynamic pair begin a journey through space aided by quotes from The Hitchhiker's ",
            "metadata": {
                "authors": [{
                    "name": "Douglas Adams"
                }],
                "keywords": [
                    "hitchhiker"
                ]
            },
            "price": 4.59,
            "thumbnailLink": "/images/books/hitchiker.jpeg",
            "type": "book"
        }
    });

    // the test option to searh for the key work Jacod Bacharach
    testOptions =
        { query: { '$text': { '$search': 'Jacob%Bacharach' } } };
    emptySearchOptions = { query: { '$text': { '$search': '' } } };
    numOfResultOptions = { query: { '$text': { '$search': 'Douglas Adams' } } }

    describe('Get product with unknown uid', function () {
        it('it should reject the promise', function () {
            return expect(repo.get(43924))
                .to.be.rejectedWith('A uid is required to get a Product');
        });
    });

    describe('Check the author for Product search for "Jacob Bacharach" skip 0 and limit 0', function () {
        it('should search with the query which match with the author', function () {
            return Promise.resolve(repo.find(testOptions))
                .then(result => {
                    result[0].metadata.authors[0].name.should.equal("Jacob Bacharach")
                })
        });
    });

    describe('Check empty search ', function () {
        it('should return empty array', function () {
            return Promise.resolve(repo.find(emptySearchOptions))
                .then(result => {
                    result.length.should.equal(0)
                })
        });
    });

    describe('Check num of result from the "Douglas Adams" search ', function () {
        it('should return result number: 4 from search ', function () {
            return Promise.resolve(repo.find(numOfResultOptions))
                .then(result => {
                    result.length.should.equal(4)
                })
        });
    });

});
