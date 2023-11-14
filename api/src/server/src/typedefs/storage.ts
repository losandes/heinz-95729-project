import { z } from 'zod'
import type Keyv from 'keyv'

const zKeyv: z.ZodType<Keyv> = z.any()

export const storageSchema = z.object({
  users: zKeyv,
  products: zKeyv,
})

export type storageSchema = z.infer<typeof storageSchema>

export default storageSchema
