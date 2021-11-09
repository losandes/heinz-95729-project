/* eslint-disable camelcase */

exports.up = async function (knex) {
  const time_created_ms = Date.now()

  await knex('users').insert([{
    id: '3d6b8e1b-b071-4b38-a11f-2a24fce5461e',
    email: 'shopper1@95729.com',
    name: 'Shopper 1',
    time_created_ms,
  }, {
    id: 'ea0a9e9b-25df-4fb0-9e51-26070733c596',
    email: 'shopper2@95729.com',
    name: 'Shopper 2',
    time_created_ms,
  }, {
    id: '0698c581-049c-4e0c-9bbb-bd3dc7a1d670',
    email: 'shopper3@95729.com',
    name: 'Shopper 3',
    time_created_ms,
  }, {
    id: 'd0f326c4-c934-484a-96bd-c66bde7e0b63',
    email: 'shopper4@95729.com',
    name: 'Shopper 4',
    time_created_ms,
  }])
}

exports.down = async function (knex) {
  await knex('users').del()
}
