/* global describe it */
const expect = require('chai').expect
const ObjectID = require('bson-objectid')
const polyn = require('polyn')

const logger = require('../common/loggers/logger.js').factory
const User = require('../users/User.js').factory(polyn, ObjectID, logger)
const UserPurchaseHistory = require('../users/UserPurchaseHistory.js').factory(polyn, ObjectID, logger)
const usersRepoFactory = require('../users/usersRepo.js').factory

const makeMockDb = (expectedError, expectedRes) => {
  return {
    collection: () => {
      return {
        createIndex: () => {},
        find: () => {
          return {
            limit: () => {
              return {
                next: (callback) => {
                  return callback(expectedError, expectedRes)
                }
              }
            }
          }
        }
      }
    }
  }
}

const expectedUser = {
  name: 'Foo Bar',
  email: 'abc@123.com'
}

describe('usersRepo', function () {
  describe('when I get a user', function () {
    it('it should return a User object', function () {
      const repo = usersRepoFactory(makeMockDb(null, expectedUser), UserPurchaseHistory, User, polyn)
      repo.get('abc@123.com')
        .then(() => (err, actual) => {
          // eslint expecting error to be handled.
          if (err) {}
          expect(actual.name).to.equal(expectedUser.name)
          expect(actual.email).to.equal(expectedUser.email)
        })
    })
  })
})

