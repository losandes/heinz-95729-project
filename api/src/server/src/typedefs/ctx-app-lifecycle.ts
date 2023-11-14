import { z } from 'zod'
import envvars from './env'
import { loggerSchema } from './logger'
import { storageSchema } from './storage'

/**
 * # appCtxSchema
 * This is the schema for the app lifecycle (generated per app
 * startup / runtime) variables and tools. Several of these properties
 * end up in or produce variables/tools that are added to the
 * request context (`ctx.state`; see ctx-req-lifecycle).
 */
export const appCtxSchema = z.object({
  env: envvars,
  logger: loggerSchema,
  storage: storageSchema,
})

export type appCtxSchema = z.infer<typeof appCtxSchema>

export default appCtxSchema
