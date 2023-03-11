import test from 'test'
import expect from 'unexpected'
import { deauthorize } from '@heinz-95729/auth'

const mockCtx = () => {
  /** @type {Object.<string, string>} */
  const headers = {}
  const set = (
    /** @type {string} */ key,
    /** @type {string} */ value,
  ) => { headers[key] = value }
  const response = { headers, set, body: null, status: 0 }

  return { response }
}

const given = '@heinz-95729/auth deauthorize:'

const when = {
  calledWithValidRedirectURL: {
    c: `${given} when auth is called with a valid redirectURL`,
    s: async () => {
      const redirectURL = 'http://localhost:3000/deauthorize'
      const route = deauthorize(redirectURL)
      const ctx = mockCtx()
      // @ts-ignore
      await route(ctx)

      return { ctx, redirectURL }
    },
  },
}

test(when.calledWithValidRedirectURL.c +
  'it should add an HTML page to the response body',
async () => {
  const { ctx, redirectURL } = await when.calledWithValidRedirectURL.s()

  expect(ctx.response.body, 'to contain', '<html>')
  expect(ctx.response.body, 'to contain', redirectURL)
})

test(when.calledWithValidRedirectURL.c +
  'it should set the Content-Type header',
async () => {
  const { ctx } = await when.calledWithValidRedirectURL.s()

  expect(ctx.response.headers['Content-Type'], 'to equal', 'text/html')
})

test(when.calledWithValidRedirectURL.c +
  'it should set the status to 200',
async () => {
  const { ctx } = await when.calledWithValidRedirectURL.s()
  expect(ctx.response.status, 'to equal', 200)
})
