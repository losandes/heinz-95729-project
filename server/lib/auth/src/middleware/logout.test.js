import test from 'supposed'
import expect from 'unexpected'
import { logout } from '@heinz-95729/auth'
import { makeMockKoaContext } from '@heinz-95729/test-utils'

const given = '@heinz-95729/auth logout'
const makeRedirect = () => 'ignore'
const next = async () => {}

test([given,
  'when the session is invalid',
  'it should reject'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext()
  const sut = logout(
    makeRedirect,
    {
      verify: (ctx) => async () => Promise.reject(new Error('BOOM!')),
      revoke: (ctx) => Promise.resolve,
    })

  expect(sut(ctx, next), 'to be rejected')
})

const { getResult } = LazySingleton(async () => {
  const { ctx } = await makeMockKoaContext(
    resolves((email) => ({
      email,
      id: createId(),
      name: 'Foo',
    })),
  )

  const makeRedirect = (/** @type {{ request: { body: { email: any; }; }; }} */ ctx) => `redirecting ${ctx.request.body.email}`

  /** @type {string} */
  let signed // eslint-disable-line functional/no-let
  /** @type {string} */
  let stored // eslint-disable-line functional/no-let
  const sign = (/** @type {{ request: { body: { email: any; }; }; }} */ ctx) =>
    (/** @type {ISession} */ session) => {
      signed = `session signed for body: ${ctx.request.body.email}, session: ${session.user.email}`
      return signed
    }
  const store = (/** @type {{ request: { body: { email: any; }; }; }} */ ctx) =>
    (/** @type {ISession} */ session) => {
      stored = `session stored for body: ${ctx.request.body.email}, session: ${session.user.email}`
    }

  const actual = await login(makeRedirect, { sign, store })(ctx)

  return {
    actual,
    ctx,
    sign,
    signed: () => signed,
    store,
    stored: () => stored,
  }
})

test([given,
  'when the session is valid',
  'it should set a cookie on the context'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext()
  const sut = logout(
    makeRedirect,
    {
      verify: (ctx) => async () => ({

      }),
      revoke: (ctx) => Promise.resolve,
    })

  expect(
    ctx.cookies.responseCookies.h95729.value,
    'to equal',
    'session signed for body: foo@example.com, session: foo@example.com',
  )
  expect(
    ctx.cookies.responseCookies.h95729.opts,
    'to satisfy',
    {
      sameSite: 'lax',           // limit the scope of the cookie to this site, but allow top level redirects
      path: '/',                 // set the relative path that the cookie is scoped for
      httpOnly: true,            // dissallow client-side access to the cookie
      overwrite: true,           // overwrite the cookie every time, so nonce data is never re-used
    },
  )
})

test(['TODO', given,
  'when the session is valid',
  'it should set the response status to 302'].join(', '),
async () => {
  // const { ctx } = await getResult()

  // expect(ctx.response.status, 'to equal', 302)
})

test(['TODO', given,
  'when the session is valid',
  'it should pass the context to the makeRedirect function',
  'and it should set the response redirect to the output of the makeRedirect function'].join(', '),
async () => {
  // const { ctx } = await getResult()

  // expect(ctx.res._headers.location, 'to equal', 'redirecting%20foo@example.com')
})

// /**
//  * Generates a Koa middleware that signs the user out
//  * (via a cookie overwrite) and redirects them to the
//  * location produced by the _makeRedirect_ param
//  * @param {(ctx: IKoaContext) => string} makeRedirect
//  * @returns {IKoaMiddleware}
//  */
// export const logout = (makeRedirect) => async (ctx) => {
//   const { env, logger } = ctx.state
//   const {
//     NODE_ENV_ENFORCE_SECURITY,
//     SESSIONS_COOKIE_NAME,
//   } = env

//   try {
//     const session = await verify(ctx)(ctx.cookies.get(env.SESSIONS_COOKIE_NAME))
//     await revoke(ctx)(session)

//     ctx.cookies.set(SESSIONS_COOKIE_NAME, 'expired', {
//       maxAge: -99999999,     // will expire in (e.g. 30 days)
//       sameSite: 'lax',       // limit the scope of the cookie to this site, but allow top level redirects
//       path: '/',             // set the relative path that the cookie is scoped for
//       secure: NODE_ENV_ENFORCE_SECURITY, // only support HTTPS connections
//       httpOnly: true,        // dissallow client-side access to the cookie
//       overwrite: true,       // overwrite the cookie every time, so nonce data is never re-used
//     })

//     ctx.response.status = 302
//     ctx.response.redirect(makeRedirect(ctx))
//     logger.emit('logout_success', 'debug')
//   } catch (err) {
//     logger.emit('logout_failure', 'error', { err })
//     throw new Error('Failed to sign the user in')
//   }
// }

// export default logout
