/**
 * @param {User} User
 */
function UserPgRepoFactory (deps) {
  'use strict'

  const { User } = deps

  /**
   * @param {pg/Pool} db - The Pool function from pg
   */
  function UserPgRepo (input) {
    const { knex } = input

    /**
     * Inserts or updates a User in the database
     * @param {IUser} input - an instance of User to upsert
     */
    const upsert = async (input) => {
      const user = new User(input)
      const res = await knex.transaction(async (trx) => {
        return trx('users')
          .insert({
            id: user.id,
            name: user.name,
            email: user.email,
            time_created_ms: Date.now(),
          })
          .onConflict('id')
          .merge([
            'name',
            'email',
          ])
      })

      if (res.rowCount !== 1) {
        const err = new Error('The number of operations to upsert a record was not expected')
        err.data = res
      }

      return { user, res }
    }

    const mapResults = (results) => results.map((record) => new User({
      id: record.id,
      name: record.name,
      email: record.email,
    }))

    /**
     * Gets a User by email
     * @param {string} email - the email of the User to get (i.e. `test@95729.com`)
     * @returns {IUser | null} - an instance of User if a record was found, otherwise null
     */
    const userByEmail = async (email) => {
      const results = mapResults(await knex('users').where('email', email))

      return results.length ? results[0] : null
    }

    /**
     * Gets a User by id
     * @param {string} id - the ID of the User to get (i.e. `e0ed9bc0-6e4c-4d7f-9d98-46714ffa357c`)
     * @returns {IUser | null} - an instance of User if a record was found, otherwise null
     */
    const userById = async (id) => {
      const results = mapResults(await knex('users').where('id', id))

      return results.length ? results[0] : null
    }

    /**
     * Deletes a User by id
     * @param {string} id - the ID of the Users to delete (i.e. `e0ed9bc0-6e4c-4d7f-9d98-46714ffa357c`)
     * @returns {boolean} - whether or not the record was deleted
     */
    const deleteById = async (id) => {
      const count = await knex('users').where('id', id).del()

      return count > 0
    }

    return {
      upsert,
      get: {
        byEmail: userByEmail,
        byId: userById,
      },
      delete: {
        byId: deleteById,
      },
    }
  }

  return { UserPgRepo }
}

module.exports = UserPgRepoFactory
