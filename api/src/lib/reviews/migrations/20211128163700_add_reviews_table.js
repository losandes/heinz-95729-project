
exports.up = async function (knex) {
  const sql = `CREATE TABLE reviews (
    id UUID PRIMARY KEY NOT NULL,
    user_id UUID NOT NULL,
    book_id TEXT NOT NULL,
    rating DECIMAL NOT NULL,
    description TEXT NOT NULL
);`

  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    return await trx.raw('DROP TABLE reviews;')
  })
}
