import { createId } from '@paralleldrive/cuid2'
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string().cuid2().default(createId),
  email: z.string().email(),
  name: z.string().min(2).trim(),
  timeCreatedMs: z.number().int().default(Date.now),
})

export type userSchema = z.infer<typeof userSchema>

export default userSchema
