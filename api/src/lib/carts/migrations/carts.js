exports.up = async function (knex) {
  const sql = `CREATE TABLE carts (
      id UUID PRIMARY KEY NOT NULL,
      productid TEXT NOT NULL,
      userid TEXT NOT NULL,
      time_added_ms BIGINT NOT NULL
  );

  COMMENT ON COLUMN carts.id IS 'The record id';
  COMMENT ON COLUMN carts.productid IS 'The product id';
  COMMENT ON COLUMN carts.userid IS 'The user ID';
  COMMENT ON COLUMN carts.time_added_ms IS 'The time of product added to cart, in milliseconds';`

  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    return await trx.raw('DROP TABLE carts;')
  })
}
