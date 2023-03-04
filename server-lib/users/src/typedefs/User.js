import { is, registerBlueprint, required } from '@polyn/blueprint'
import { immutable } from '@polyn/immutable'
import { createId, isCuid } from '@paralleldrive/cuid2'

const userBlueprint = {
  id: required('string').from(({ value }) => {
    if (isCuid(value)) {
      return value
    } else if (is.string(value)) {
      throw new Error('Expected the id to be a Cuid2')
    } else {
      return createId
    }
  }),
  email: 'string',
  name: 'string',
  timeCreatedMs: 'number',
}

registerBlueprint('User', userBlueprint)

/** @type {ImmutableUser} */
const _User = immutable('User', userBlueprint)

/** @type {User} */
export default class User extends _User {
  static blueprint = userBlueprint
}
