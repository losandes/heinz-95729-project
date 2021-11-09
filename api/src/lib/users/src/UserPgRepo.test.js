module.exports = (test, dependencies) => {
  'use strict'

  const { userRepo } = dependencies.Users
  const REGEX_UUID = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  const itShouldHaveDeleted = (expect) => (err, result) => {
    expect(err, 'to be', null)
    expect(result.deleted, 'to equal', true)
  }

  const itShouldSetValues = (expect) => (err, result) => {
    expect(err, 'to be', null)
    const { got, expected } = result

    expect(got.name, 'to equal', expected.name)
    expect(got.email, 'to equal', expected.email)
  }

  return test('given @heinz-95729-api/users userRepo', {
    'when a record is inserted': {
      when: async () => {
        const expected = {
          email: 'test-insert@95729.com',
          name: 'Test Insert',
        }
        const inserted = await userRepo.upsert(expected)
        const got = await userRepo.get.byId(inserted.user.id)
        const deleted = await userRepo.delete.byId(inserted.user.id)

        return { inserted, got, deleted, expected }
      },
      'it should insert a record': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(result.inserted.res.command, 'to equal', 'INSERT')
      },
      'it should generate a uuid': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(REGEX_UUID.test(result.inserted.user.id), 'to equal', true)
      },
      'it should set all of the values': itShouldSetValues,
      'this test should have cleaned up': itShouldHaveDeleted,
    },
    'when a record is updated': {
      when: async () => {
        const insert = {
          email: 'test-update@95729.com',
          name: 'Test Update',
        }
        const expected = {
          email: 'test-update-2@95729.com',
          name: 'Test Update 2',
        }
        const inserted = await userRepo.upsert(insert)
        const updated = await userRepo.upsert(
          inserted.user.patch(expected),
        )
        const got = await userRepo.get.byId(inserted.user.id)
        const deleted = await userRepo.delete.byId(inserted.user.id)

        return { inserted, updated, got, deleted, expected }
      },
      'it should upsert a record': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(result.updated.res.command, 'to equal', 'INSERT')
      },
      'the inserted and upserted ids should match': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(result.inserted.user.id, 'to equal', result.updated.user.id)
      },
      'it should set all of the values': itShouldSetValues,
      'this test should have cleaned up': itShouldHaveDeleted,
    },
    'when a record is retrieved by email': {
      when: async () => {
        const expected = {
          email: 'test-retrieve-email@95729.com',
          name: 'Test Retrieve Email',
        }
        const inserted = await userRepo.upsert(expected)
        const got = await userRepo.get.byEmail(inserted.user.email)
        const deleted = await userRepo.delete.byId(inserted.user.id)

        return { inserted, got, deleted, expected }
      },
      'it should return the record as a Product': itShouldSetValues,
      'this test should have cleaned up': itShouldHaveDeleted,
    },
    'when a record is retrieved by id': {
      when: async () => {
        const expected = {
          email: 'test-retrieve-id@95729.com',
          name: 'Test Retrieve ID',
        }
        const inserted = await userRepo.upsert(expected)
        const got = await userRepo.get.byId(inserted.user.id)
        const deleted = await userRepo.delete.byId(inserted.user.id)

        return { inserted, got, deleted, expected }
      },
      'it should return the record as a Product': itShouldSetValues,
      'this test should have cleaned up': itShouldHaveDeleted,
    },
    'when a record is deleted': {
      when: async () => {
        const expected = {
          email: 'test-delete@95729.com',
          name: 'Test Delete',
        }
        const inserted = await userRepo.upsert(expected)
        const deleted = await userRepo.delete.byId(inserted.user.id)
        const got = await userRepo.get.byId(inserted.user.id)

        return { inserted, got, deleted, expected }
      },
      'it should return true': itShouldHaveDeleted,
      'it should delete the record': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(result.got, 'to be', null)
      },
    },
  })
}
