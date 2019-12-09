/*
 * This test provides an example of partial coverage for usersRepo.js. It only
 * evaluates the `get` function, and is a good place to start practicing,
 * because there are other tests in the same file from which to draw inspiration.
 */
module.exports = (test, dependencies) => {
  // supposed can inject dependencies. To see where these are coming from,
  // look at api/test.js::Suite.inject
  const { blueprint, immutable, ObjectID, logger } = dependencies

  // This is the system under test (SUT). It is composed in the tests themselves,
  // so they can inject happy, and negative path scenarios
  const usersRepoFactory = require('./usersRepo').factory

  // compose the dependencies for usersRepo.js
  // some of these are mocks, and others aren't (User is not, db is)
  const User = require('./User.js').factory(blueprint, immutable, ObjectID, logger)
  // you could also connect to the actual database here if you wanted to
  // see the `connectToAndRegisterDataConnection` function in composition.js for
  // an example of how to connect to the database
  const makeMockDb = (expectedError, expectedRes) => {
    return {
      collection: () => {
        return {
          createIndex: () => {},
          find: () => {
            return {
              limit: () => {
                return {
                  next: (callback) => callback(expectedError, expectedRes)
                }
              }
            }
          }
        }
      }
    }
  }

  // Some other mock data to use in the tests
  const expectedError = new Error('THIS IS A TEST')
  const expectedUser = {
    name: 'Foo Bar',
    email: 'abc@123.com'
  }

  // Supposed expects us to return a `test`, so it can await it's completion
  return test('given usersRepo', {
    'when get is called, and a document is returned by the database': {
      given: async () => {
        // set up the happy path
        const db = makeMockDb(null, expectedUser)
        return usersRepoFactory(db, User, blueprint)
      },
      when: async (repo) => repo.get(expectedUser.email),
      'it should satisfy the promise with a user document': (expect) => (err, actual) => {
        expect(err).to.equal(null)
        expect({
          name: actual.name,
          email: actual.email
        }).to.deep.equal(expectedUser)
      }
    },
    'when get is called, and a document is NOT returned by the database': {
      given: async () => {
        // set up the happy path
        const db = makeMockDb(null, null)
        return usersRepoFactory(db, User, blueprint)
      },
      when: async (repo) => repo.get(expectedUser.email),
      'it should satisfy the promise, returning undefined': (expect) => (err, actual) => {
        expect(err).to.equal(null)
        expect(typeof actual).to.equal('undefined')
      }
    },
    'when get is called with a missing email address': {
      given: async () => {
        return usersRepoFactory(makeMockDb(null, null), User, blueprint)
      },
      when: async (repo) => repo.get(),
      'it should reject the promise': (expect) => (err) => {
        expect(err.message).to.equal('An email is required to get a User')
      }
    },
    'when get is called with a non-string email address': {
      given: async () => {
        return usersRepoFactory(makeMockDb(null, null), User, blueprint)
      },
      when: async (repo) => repo.get(1),
      'it should reject the promise': (expect) => (err) => {
        expect(err.message).to.equal('An email is required to get a User')
      }
    },
    'when get is called, and the database returns an error': {
      given: async () => {
        return usersRepoFactory(makeMockDb(expectedError, null), User, blueprint)
      },
      when: async (repo) => repo.get(expectedUser.email),
      'it should reject the promise': (expect) => (err, actual) => {
        expect(err.message).to.equal(expectedError.message)
      }
    }
  })
}
