import { z } from 'zod'

export const sessionSchema = z.object({
  id: z.string().trim().cuid2(),
  user: z.object({
    id: z.string().trim().cuid2(),
    email: z.string().trim().email(),
    name: z.string().trim().min(2),
  }),
})

export type sessionSchema = z.infer<typeof sessionSchema>

export default sessionSchema
