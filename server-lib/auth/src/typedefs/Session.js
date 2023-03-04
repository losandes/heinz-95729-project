import { registerBlueprint } from '@polyn/blueprint'
import { immutable } from '@polyn/immutable'

const sessionBlueprint = {
  id: 'string',
  email: 'string',
  name: 'string',
}

registerBlueprint('Session', sessionBlueprint)

/** @type {ImmutableSession} */
const _Session = immutable('Session', sessionBlueprint)

/** @type {Session} */
export default class Session extends _Session {
  static blueprint = sessionBlueprint
}
