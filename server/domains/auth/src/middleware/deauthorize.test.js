import test from 'supposed'
import expect from 'unexpected'
import { makeMockKoaContext } from '../../../../lib/test-utils/index.js'
import { deauthorize } from '../../index.js'

const given = 'server::domains::auth::deauthorize'

const when = {
  calledWithValidRedirectURL: {
    c: `${given} when auth is called with a valid redirectURL`,
    s: async (
      redirectURL = 'http://localhost:3000/deauthorize',
      makeCtx = makeMockKoaContext,
    ) => {
      const route = deauthorize(redirectURL)
      const { ctx } = await makeCtx()

      await route(ctx, async () => {})

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

  expect(ctx.response.get('Content-Type'), 'to equal', 'text/html')
})

test(when.calledWithValidRedirectURL.c +
  'it should set the status to 200',
async () => {
  const { ctx } = await when.calledWithValidRedirectURL.s()
  expect(ctx.response.status, 'to equal', 200)
})
