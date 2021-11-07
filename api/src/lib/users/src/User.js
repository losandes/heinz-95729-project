/**
 * @param {@polyn/blueprint} blueprint
 * @param {@polyn/immutable} immutable
 * @param {uuid/v4} uuid
 */
function UserFactory (deps) {
  'use strict'

  const { registerBlueprint, optional } = deps.blueprint
  const { immutable } = deps.immutable
  const { uuid } = deps

  const REGEX = {
    UUID: /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
  }

  const UserBlueprint = {
    id: optional(REGEX.UUID).withDefault(uuid),
    name: 'string',
    email: 'string',
  }

  registerBlueprint('User', UserBlueprint)
  const User = immutable('User', UserBlueprint)
  User.blueprint = UserBlueprint

  return { User }
}

module.exports = UserFactory
