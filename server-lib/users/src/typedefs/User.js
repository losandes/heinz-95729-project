import { immutable } from '@heinz-95729/immutable'
import { createId } from '@paralleldrive/cuid2'
import { z } from 'zod'

const userSchema = {
  id: z.string().cuid2().default(createId),
  email: z.string().email(),
  name: z.string().min(2).trim(),
  timeCreatedMs: z.number().int().default(Date.now),
}

/** @type {ImmutableUser} */
const _User = immutable('User', userSchema)

/** @type {User} */
export default class User extends _User {
  static schema = userSchema
}
