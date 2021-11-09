module.exports = (test, dependencies) => {
  'use strict'

  const { productRepo } = dependencies.Products
  const REGEX_UUID = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

  const itShouldHaveDeleted = (expect) => (err, result) => {
    expect(err, 'to be', null)
    expect(result.deleted, 'to equal', true)
  }

  const itShouldSetValues = (expect) => (err, result) => {
    expect(err, 'to be', null)
    const { got, expected } = result

    expect(got.uid, 'to equal', expected.uid)
    expect(got.title, 'to equal', expected.title)
    expect(got.description, 'to equal', expected.description)
    expect(got.price, 'to equal', expected.price)
    expect(got.thumbnailHref, 'to equal', expected.thumbnailHref)
    expect(got.type, 'to equal', expected.type)
    expect(got.metadata.authors[0].name, 'to equal', expected.metadata.authors[0].name)
    expect(got.metadata.keywords[0], 'to equal', expected.metadata.keywords[0])
    expect(got.metadata.keywords[1], 'to equal', expected.metadata.keywords[1])
  }

  return test('given @heinz-95729-api/products productRepo', {
    'when a record is inserted': {
      when: async () => {
        const expected = {
          uid: 'before_go_insert_test',
          title: 'One Last Thing Before I Go Test Insert',
          description: '“Mistakes have been made.” Drew Silver has begun to accept that life isn’t going to turn out as he expected. His fleeting fame as the drummer for a one-hit wonder rock band is nearly a decade behind him. His ex-wife is about to marry a terrific guy. And his Princeton-bound teenage daughter Casey has just confided in him that she’s pregnant—because Silver is the one she cares least about letting down.',
          metadata: {
            keywords: ['test', 'insert'],
            authors: [{
              name: 'Jonathan Tropper',
            }],
          },
          price: 8.77,
          thumbnailHref: '/images/books/beforeIGo.jpg',
          type: 'book',
        }
        const inserted = await productRepo.upsert(expected)
        const got = await productRepo.get.byId(inserted.product.id)
        const deleted = await productRepo.delete.byId(inserted.product.id)

        return { inserted, got, deleted, expected }
      },
      'it should insert a record': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(result.inserted.res.command, 'to equal', 'INSERT')
      },
      'it should generate a uuid': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(REGEX_UUID.test(result.inserted.product.id), 'to equal', true)
      },
      'it should set all of the values': itShouldSetValues,
      'this test should have cleaned up': itShouldHaveDeleted,
    },
    'when a record is updated': {
      when: async () => {
        const insert = {
          uid: 'before_go_upsert_test',
          title: 'One Last Thing Before I Go Upsert Test (insert)',
          description: '“Mistakes have been made.” Drew Silver has begun to accept that life isn’t going to turn out as he expected. His fleeting fame as the drummer for a one-hit wonder rock band is nearly a decade behind him. His ex-wife is about to marry a terrific guy. And his Princeton-bound teenage daughter Casey has just confided in him that she’s pregnant—because Silver is the one she cares least about letting down.',
          metadata: {
            keywords: ['test', 'insert'],
            authors: [{
              name: 'Jonathan Tropper',
            }],
          },
          price: 8.77,
          thumbnailHref: '/images/books/beforeIGo.jpg',
          type: 'book',
        }
        const expected = {
          uid: 'before_go_upsert_test',
          title: 'One Last Thing Before I Go Upsert Test',
          description: 'updated',
          metadata: {
            keywords: ['test', 'update'],
            authors: [{
              name: 'Jonathan Tropper',
            }],
          },
          price: 9.99,
          thumbnailHref: '/images/books/beforeIGo2.jpg',
          type: 'book',
        }
        const inserted = await productRepo.upsert(insert)
        const updated = await productRepo.upsert(
          inserted.product.patch(expected),
        )
        const got = await productRepo.get.byId(updated.product.id)
        const deleted = await productRepo.delete.byId(inserted.product.id)

        return { inserted, updated, got, deleted, expected }
      },
      'it should upsert a record': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(result.updated.res.command, 'to equal', 'INSERT')
      },
      'the inserted and upserted ids should match': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(result.inserted.product.id, 'to equal', result.updated.product.id)
      },
      'it should set all of the values': itShouldSetValues,
      'this test should have cleaned up': itShouldHaveDeleted,
    },
    'when a record is retrieved by id': {
      when: async () => {
        const expected = {
          uid: 'before_go_getById_test',
          title: 'One Last Thing Before I Go Test getById',
          description: '“Mistakes have been made.” Drew Silver has begun to accept that life isn’t going to turn out as he expected. His fleeting fame as the drummer for a one-hit wonder rock band is nearly a decade behind him. His ex-wife is about to marry a terrific guy. And his Princeton-bound teenage daughter Casey has just confided in him that she’s pregnant—because Silver is the one she cares least about letting down.',
          metadata: {
            keywords: ['test', 'getById'],
            authors: [{
              name: 'Jonathan Tropper',
            }],
          },
          price: 8.77,
          thumbnailHref: '/images/books/beforeIGo.jpg',
          type: 'book',
        }
        const inserted = await productRepo.upsert(expected)
        const got = await productRepo.get.byId(inserted.product.id)
        const deleted = await productRepo.delete.byId(inserted.product.id)

        // console.log(expected.metadata, inserted.product.metadata, got.metadata)
        return { inserted, got, deleted, expected }
      },
      'it should return the record as a Product': itShouldSetValues,
      'this test should have cleaned up': itShouldHaveDeleted,
    },
    'when a record is retrieved by uid': {
      when: async () => {
        const expected = {
          uid: 'before_go_getByUid_test',
          title: 'One Last Thing Before I Go Test getByUid',
          description: '“Mistakes have been made.” Drew Silver has begun to accept that life isn’t going to turn out as he expected. His fleeting fame as the drummer for a one-hit wonder rock band is nearly a decade behind him. His ex-wife is about to marry a terrific guy. And his Princeton-bound teenage daughter Casey has just confided in him that she’s pregnant—because Silver is the one she cares least about letting down.',
          metadata: {
            keywords: ['test', 'getByUid'],
            authors: [{
              name: 'Jonathan Tropper',
            }],
          },
          price: 8.77,
          thumbnailHref: '/images/books/beforeIGo.jpg',
          type: 'book',
        }
        const inserted = await productRepo.upsert(expected)
        const got = await productRepo.get.byUid(inserted.product.uid)
        const deleted = await productRepo.delete.byId(inserted.product.id)

        return { inserted, got, deleted, expected }
      },
      'it should return the record as a Product': itShouldSetValues,
      'this test should have cleaned up': itShouldHaveDeleted,
    },
    'when a record is deleted': {
      when: async () => {
        const expected = {
          uid: 'before_go_deleteById_test',
          title: 'One Last Thing Before I Go Test deleteById',
          description: '“Mistakes have been made.” Drew Silver has begun to accept that life isn’t going to turn out as he expected. His fleeting fame as the drummer for a one-hit wonder rock band is nearly a decade behind him. His ex-wife is about to marry a terrific guy. And his Princeton-bound teenage daughter Casey has just confided in him that she’s pregnant—because Silver is the one she cares least about letting down.',
          metadata: {
            keywords: ['test', 'deleteById'],
            authors: [{
              name: 'Jonathan Tropper',
            }],
          },
          price: 8.77,
          thumbnailHref: '/images/books/beforeIGo.jpg',
          type: 'book',
        }
        const inserted = await productRepo.upsert(expected)
        const deleted = await productRepo.delete.byId(inserted.product.id)
        const got = await productRepo.get.byId(inserted.product.id)

        return { inserted, got, deleted, expected }
      },
      'it should return true': itShouldHaveDeleted,
      'it should delete the record': (expect) => (err, result) => {
        expect(err, 'to be', null)
        expect(result.got, 'to be', null)
      },
    },
    'when I search for a record': {
      'with a word': {
        when: async () => {
          const expected = {
            uid: 'this_is_happiness_test_findByWord',
            title: 'This is Happiness Test FindByWord',
            description: 'A profound and enchanting new novel from Booker Prize-longlisted author Niall Williams about the loves of our lives and the joys of reminiscing.',
            metadata: {
              keywords: ['test', 'findByWord'],
              authors: [{
                name: 'Niall Williams',
              }],
            },
            price: 8.77,
            thumbnailHref: '/images/books/thisIsHappiness.jpg',
            type: 'book',
          }
          const inserted = await productRepo.upsert(expected)
          const found = await productRepo.find('findByWord')
          const deleted = await productRepo.delete.byId(inserted.product.id)

          return { inserted, found, deleted, expected }
        },
        'it should return an array of results': (expect) => (err, result) => {
          expect(err, 'to be', null)
          expect(Array.isArray(result.found), 'to equal', true)
        },
        'it should include the expected results': (expect) => (err, result) => {
          expect(err, 'to be', null)
          const found = result.found.filter((book) => book.id === result.inserted.product.id)
          expect(found.length, 'to equal', 1)
        },
        'this test should have cleaned up': itShouldHaveDeleted,
      },
      'with a phrase': {
        when: async () => {
          const expected = {
            uid: 'before_go_findByPhrase_test',
            title: 'One Last Thing Before I Go Test findByPhrase',
            description: '“Mistakes have been made.” Drew Silver has begun to accept that life isn’t going to turn out as he expected. His fleeting fame as the drummer for a one-hit wonder rock band is nearly a decade behind him. His ex-wife is about to marry a terrific guy. And his Princeton-bound teenage daughter Casey has just confided in him that she’s pregnant—because Silver is the one she cares least about letting down.',
            metadata: {
              keywords: ['test', 'findByPhrase'],
              authors: [{
                name: 'Jonathan Tropper',
              }],
            },
            price: 8.77,
            thumbnailHref: '/images/books/beforeIGo.jpg',
            type: 'book',
          }
          const inserted = await productRepo.upsert(expected)
          const found1 = await productRepo.find('Go Test findByPhrase')
          const found2 = await productRepo.find('Before I Go')
          const deleted = await productRepo.delete.byId(inserted.product.id)

          return { inserted, found1, found2, deleted, expected }
        },
        'it should return an array of results': (expect) => (err, result) => {
          expect(err, 'to be', null)
          expect(Array.isArray(result.found1), 'to equal', true)
        },
        'it should include the expected results': (expect) => (err, result) => {
          expect(err, 'to be', null)
          const found = result.found1.filter((book) => book.id === result.inserted.product.id)
          expect(found.length, 'to equal', 1)
        },
        'it should return multiple results if appropriate': (expect) => (err, result) => {
          expect(err, 'to be', null)
          expect(result.found2.length, 'to be greater than', 1)
        },
        'this test should have cleaned up': itShouldHaveDeleted,
      },
      'and the query is empty': {
        when: async () => {
          const found = await productRepo.find()

          return { found }
        },
        'it should return an empty array': (expect) => (err, result) => {
          expect(err, 'to be', null)
          expect(Array.isArray(result.found), 'to equal', true)
          expect(result.found.length, 'to equal', 0)
        },
      },
    },
  })
}
