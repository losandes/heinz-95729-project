import { z } from 'zod'

/** @type {ZSession} */
export const session = z.object({
  id: z.string().cuid2(),
  user: z.object({
    id: z.string().cuid2(),
    email: z.string().email(),
    name: z.string().min(2),
  }),
})

export default session
