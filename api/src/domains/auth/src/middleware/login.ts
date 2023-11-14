import { createId } from '@paralleldrive/cuid2'
import type { Context, Middleware } from 'koa'
import { resolveUsers } from '../../../users'
import sessionSchema from '../typedefs/session.js'
import { sign as _sign } from '../jwt/sign.js'
import { store as _store } from '../jwt/store.js'

type dependencies = {
  sign: typeof _sign
  store: typeof _store
}

/**
 * Generates a Koa middleware that signs the user in
 * (via a cookie) and redirects them to the location
 * produced by the _makeRedirect_ param
 */
export const login = (
  makeRedirect: (ctx: Context) => string,
  dependencies: dependencies = { sign: _sign, store: _store },
): Middleware => async (ctx, next) => {
  const { env, logger } = ctx.state
  const { sign, store } = dependencies
  const {
    NODE_ENV_ENFORCE_SECURITY,
    SESSIONS_COOKIE_NAME,
    SESSIONS_EXPIRE_IN_MS,
  } = env

  try {
    logger.emit('before_login', 'local', {
      requestBody: ctx.request.body,
      rawBody: ctx.request.rawBody,
    })

    const email = (ctx.request.body as { email: string } | undefined)?.email
    const user = typeof email === 'string'
      ? await resolveUsers(ctx).getBy.email(email)
      : undefined

    if (!user) {
      ctx.response.status = 404
      return
    }

    const session = sessionSchema.parse({
      id: createId(),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    logger.emit('login_success', 'debug')
    logger.emit('login_success', 'audit_info', { session })

    const token = await sign(ctx)(session) as string
    await store(ctx)(session)

    ctx.cookies.set(SESSIONS_COOKIE_NAME, token, {
      maxAge: SESSIONS_EXPIRE_IN_MS, // will expire in (e.g. 30 days)
      sameSite: 'lax',           // limit the scope of the cookie to this site, but allow top level redirects
      path: '/',                 // set the relative path that the cookie is scoped for
      secure: NODE_ENV_ENFORCE_SECURITY,     // only support HTTPS connections
      httpOnly: true,            // dissallow client-side access to the cookie
      overwrite: true,           // overwrite the cookie every time, so nonce data is never re-used
    })

    ctx.response.status = 302
    ctx.response.redirect(makeRedirect(ctx))
    next()
  } catch (err) {
    logger.emit('login_failure', 'error', { err })
    throw new Error('Failed to sign the user in')
  }
}

export default login
