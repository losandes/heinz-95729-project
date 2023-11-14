// @ts-ignore -- koa-errors is not typed
import  { e500 } from '@robotsandpencils/koa-errors'
import type { appCtxSchema } from '../typedefs/ctx-app-lifecycle';

/**
 * Sends a JSON formatted error message to the client when an
 * unhandled exception occurs. Includes the error stack based
 * on the configuration you provide.
 */
export const handleErrors = (appCtx: appCtxSchema) => e500({
  showStack: !appCtx.env.NODE_ENV_ENFORCE_SECURITY,
})

export default handleErrors
