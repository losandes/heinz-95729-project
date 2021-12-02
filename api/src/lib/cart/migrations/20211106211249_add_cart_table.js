exports.up = async function (knex) {
  const sql = `CREATE TABLE cart (
      id UUID PRIMARY KEY NOT NULL,
      userid Text NOT NULL,
      productid Text NOT NULL
  );
`


  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    return await trx.raw('DROP TABLE cart;')
  })
}
