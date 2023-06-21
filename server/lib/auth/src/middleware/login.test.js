import { createId } from '@paralleldrive/cuid2'
import test from 'supposed'
import expect from 'unexpected'
import { login } from '@heinz-95729/auth'
import { makeMockKoaContext, LazySingleton } from '@heinz-95729/test-utils'

const given = '@heinz-95729/auth login'
/**
 *
 * @param {(email?: string) => Object|undefined} makeValue
 * @returns
 */
const resolves = (makeValue) => ({
  state: {
    resolvers: {
      users: {
        getBy: {
          email: makeValue,
        },
      },
    },
  },
  body: { email: 'foo@example.com' },
})

test([given,
  'when an email is not present on the request body',
  'it should set the response status to 404'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext()

  await login()(ctx)

  expect(ctx.response.status, 'to equal', 404)
})

test([given,
  'when an email is present, but does not match a user',
  'it should set the response status to 404'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext(resolves(() => undefined))

  await login()(ctx)

  expect(ctx.response.status, 'to equal', 404)
})

test([given,
  'when an email is present and matches a user',
  'and the record is faulty',
  'it should throw'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext(
    resolves((email) => ({ email })),
  )

  expect(login()(ctx), 'to be rejected')
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
  'when an email is present and matches a user',
  'and the record is valid',
  'it should pass the context and session to the token signer'].join(', '),
async () => {
  const { signed } = await getResult()

  expect(signed(), 'to equal', 'session signed for body: foo@example.com, session: foo@example.com')
})

test([given,
  'when an email is present and matches a user',
  'and the record is valid',
  'it should pass the context and session to the store'].join(', '),
async () => {
  const { stored } = await getResult()

  expect(stored(), 'to equal', 'session stored for body: foo@example.com, session: foo@example.com')
})

test([given,
  'when an email is present and matches a user',
  'and the record is valid',
  'it should set a cookie on the context'].join(', '),
async () => {
  const { ctx } = await getResult()

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

test([given,
  'when an email is present and matches a user',
  'and the record is valid',
  'it should set the response status to 302'].join(', '),
async () => {
  const { ctx } = await getResult()

  expect(ctx.response.status, 'to equal', 302)
})

test([given,
  'when an email is present and matches a user',
  'and the record is valid',
  'it should pass the context to the makeRedirect function',
  'and it should set the response redirect to the output of the makeRedirect function'].join(', '),
async () => {
  const { ctx } = await getResult()

  expect(ctx.res._headers.location, 'to equal', 'redirecting%20foo@example.com')
})
