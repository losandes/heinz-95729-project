import { z } from 'zod'
import type Keyv from 'keyv'

const zKeyv: z.ZodType<Keyv> = z.any()

export const storageSchema = z.object({
  products: zKeyv,
  seeds: zKeyv,
  users: zKeyv,
})

export type storageSchema = z.infer<typeof storageSchema>

export default storageSchema
