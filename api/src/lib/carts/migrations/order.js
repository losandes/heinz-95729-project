exports.up = async function (knex) {
  const time_added_ms = Date.now()
  const sql = `CREATE TABLE orderhistory (
      id UUID PRIMARY KEY NOT NULL,
      productId TEXT NOT NULL,
      userId TEXT NOT NULL,
      timestamp_ms BIGINT NOT NULL,

  );

  COMMENT ON COLUMN orderhistory.id IS 'The record id';s
  COMMENT ON COLUMN orderhistory.productId IS 'The product id';
  COMMENT ON COLUMN orderhistory.userId IS 'The user ID';
  COMMENT ON COLUMN orderhistory.timestamp_ms IS 'The time of purchase, in milliseconds';`

  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    return await trx.raw('DROP TABLE orderhistory;')
  })
}
