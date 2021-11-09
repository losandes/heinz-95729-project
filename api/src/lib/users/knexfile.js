module.exports = {
  client: 'pg',
  connection: process.env.DB_CONNECTION_STRING,
  migrations: {
    tableName: 'z_migrations_users',
  },
}
