import { z } from 'zod'
import type { LogEmitter } from '@polyn/logger'

export const loggerSchema: z.ZodType<LogEmitter> = z.any()
export type loggerSchema = z.infer<typeof loggerSchema>
export default loggerSchema
