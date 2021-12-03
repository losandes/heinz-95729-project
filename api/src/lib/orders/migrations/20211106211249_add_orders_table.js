exports.up = async function (knex) {
  const sql = `CREATE TABLE orders (
      id UUID PRIMARY KEY NOT NULL,
      userid Text NOT NULL,
      productids Text NOT NULL,
      totalprice DECIMAL NOT NULL,
      purchasedate TEXT NOT NULL
  );
`


  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
      return await trx.raw('DROP TABLE orders;')
  })
}
