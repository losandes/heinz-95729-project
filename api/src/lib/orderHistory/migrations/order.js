exports.up = async function (knex) {
  const sql = `CREATE TABLE orderhistory (
      id UUID PRIMARY KEY NOT NULL,
      productid TEXT NOT NULL,
      userid TEXT NOT NULL,
      transactionid TEXT NOT NULL,
      price DECIMAL NOT NULL,
      timestamp_ms BIGINT NOT NULL
  );

  COMMENT ON COLUMN orderhistory.id IS 'The record id';
  COMMENT ON COLUMN orderhistory.productid IS 'The product id';
  COMMENT ON COLUMN orderhistory.userid IS 'The user ID';
  COMMENT ON COLUMN orderhistory.transactionid IS 'The transaction id of the purchase item';
  COMMENT ON COLUMN orderhistory.price IS 'The price of the purchase item';
  COMMENT ON COLUMN orderhistory.timestamp_ms IS 'The time of purchase, in milliseconds';`;

  await knex.transaction(async (trx) => {
    return await trx.raw(sql);
  });
};

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    return await trx.raw("DROP TABLE orderhistory;");
  });
};
