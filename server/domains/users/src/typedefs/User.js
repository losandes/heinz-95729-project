import { createId } from '@paralleldrive/cuid2'
import { z } from 'zod'

/** @type {ZUser} */
export const user = z.object({
  id: z.string().cuid2().default(createId),
  email: z.string().email(),
  name: z.string().min(2).trim(),
  timeCreatedMs: z.number().int().default(Date.now),
})

export default user
