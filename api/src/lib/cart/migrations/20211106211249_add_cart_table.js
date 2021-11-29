exports.up = async function (knex) {
  const sql = `CREATE TABLE cart (
      id Text PRIMARY KEY NOT NULL,
      userid Text NOT NULL,
      vectors TSVECTOR,
      productid Text NOT NULL
  );
CREATE INDEX idx_cart_search ON cart USING gin(vectors);
`


  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    await trx.raw('DROP INDEX idx_cart_search;')
    return await trx.raw('DROP TABLE cart;')
  })
}
