import { z } from 'zod'

/** @type {ZSession} */
export const session = z.object({
  id: z.string().trim().cuid2(),
  user: z.object({
    id: z.string().trim().cuid2(),
    email: z.string().trim().email(),
    name: z.string().trim().nonempty(),
  }),
})

export default session
