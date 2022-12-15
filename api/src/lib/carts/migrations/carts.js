exports.up = async function (knex) {
  const sql = `CREATE TABLE carts (
      id UUID PRIMARY KEY NOT NULL,
      productId TEXT NOT NULL,
      userId TEXT NOT NULL,
      time_added_ms BIGINT NOT NULL,

  );

  COMMENT ON COLUMN carts.id IS 'The record id';
  COMMENT ON COLUMN carts.productId IS 'The product id';
  COMMENT ON COLUMN carts.userId IS 'The user ID';
  COMMENT ON COLUMN carts.timestamp_ms IS 'The time of product added to cart, in milliseconds';`

  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    return await trx.raw('DROP TABLE carts;')
  })
}
