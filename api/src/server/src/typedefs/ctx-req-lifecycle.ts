import { z } from 'zod'
import envvars from './env'
import { loggerSchema } from './logger'
import { storageSchema } from './storage'
import { sessionSchema } from '../../../domains/auth'

export const reqCtxSchema = z.object({
    // request lifecycle
    affinityTime: z.number().min(0),
    affinityId: z.string().min(8),
    method: z.string().min(3),
    url: z.string(),
    origin: z.string(),
    maybeProxiedOrigin: z.string(),
    logger: loggerSchema,
    session: sessionSchema.optional(),
    // resolvers: {},
    // app lifecycle
    env: envvars,
    storage: storageSchema,
})

export type reqCtxSchema = z.infer<typeof reqCtxSchema>

export default reqCtxSchema
