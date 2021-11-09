exports.up = async function (knex) {
  const sql = `CREATE TABLE users (
      id UUID PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      time_created_ms BIGINT NOT NULL,
      constraint unq_users_email unique (email)
  );

  COMMENT ON COLUMN users.id IS 'The record id';
  COMMENT ON COLUMN users.name IS 'The full name of the user';
  COMMENT ON COLUMN users.email IS 'The email address of the user';
  COMMENT ON COLUMN users.time_created_ms IS 'The time this record was created, in milliseconds';`

  await knex.transaction(async (trx) => {
    return await trx.raw(sql)
  })
}

exports.down = async function (knex) {
  await knex.transaction(async (trx) => {
    return await trx.raw('DROP TABLE users;')
  })
}
