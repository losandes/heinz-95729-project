import test from 'supposed'
import expect from 'unexpected'
import { makeMockKoaContext } from '@heinz-95729/test-utils'

const givenMockCtx = 'given @heinz-95729/test-utils makeMockKoaContext'

test([givenMockCtx, 'it should set 404 as the default status code'].join(', '),
  async () => {
    const { ctx } = await makeMockKoaContext()

    expect(ctx.response.status, 'to equal', 404)
  })

test([givenMockCtx, 'when constructed with a request url and method',
  'it should that url and method'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext({
    req: {
      url: '/api/login',
      method: 'POST',
    },
  })

  expect(ctx.request.method, 'to equal', 'POST')
  expect(ctx.request.url, 'to equal', '/api/login')
})

test([givenMockCtx, 'when constructed with a body on the request',
  'it should set the rawBody'].join(', '),
async () => {
  const body = { foo: 'bar' }
  const { ctx } = await makeMockKoaContext({ body })

  expect(ctx.request.body, 'to equal', body)
  expect(ctx.request.rawBody, 'to equal', JSON.stringify(body))
})

test([givenMockCtx, 'when constructed with a rawBody on the request',
  'it should set the body'].join(', '),
async () => {
  const body = { foo: 'bar' }
  const { ctx } = await makeMockKoaContext({ rawBody: JSON.stringify(body) })

  expect(ctx.request.body, 'to equal', body)
  expect(ctx.request.rawBody, 'to equal', JSON.stringify(body))
})

test([givenMockCtx, 'when constructed with cookies',
  'it should put the cookies on the requestStore'].join(', '),
async () => {
  const cookies = { foo: 'bar' }
  const { ctx } = await makeMockKoaContext({ cookies })

  expect(ctx.cookies.requestStore.get('foo'), 'to equal', 'bar')
})

test([givenMockCtx, 'when constructed with request headers',
  'it should support header retrieval'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext({
    req: {
      headers: {
        Referer: 'foo',
      },
    },
  })

  expect(ctx.request.get('Referer'), 'to equal', 'foo')
})

test([givenMockCtx, 'when headers are set on the response',
  'it should support header retrieval'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext()
  ctx.response.set('Content-Type', 'text/html')

  expect(ctx.response.get('Content-Type'), 'to equal', 'text/html')
})

test([givenMockCtx, 'it should include mock state'].join(', '),
  async () => {
    const { ctx } = await makeMockKoaContext()

    expect(ctx.state.env.NODE_ENV, 'to equal', 'test')
  })

test([givenMockCtx, 'when constructed with custom state',
  'it should merge the custom state into the default mock state'].join(', '),
async () => {
  const { ctx } = await makeMockKoaContext({
    state: {
      url: 'http://localhost:3001/api/logout',
    },
  })

  expect(ctx.state.env.NODE_ENV, 'to equal', 'test')
  expect(ctx.state.url, 'to equal', 'http://localhost:3001/api/logout')
})

test([givenMockCtx, 'it should include an inspectable logger'].join(', '),
  async () => {
    const { ctx } = await makeMockKoaContext()

    ctx.state.logger.emit('includes_inspectable_logger', 'info', { foo: 'bar' })
    ctx.state.logger.emit('includes_inspectable_logger', 'info', { foo: 'baz' })

    expect(ctx.state.logger.logs()[0].log.foo, 'to equal', 'bar')
    expect(ctx.state.logger.logs()[0].meta, 'to satisfy', {
      event: 'includes_inspectable_logger',
      category: 'info',
    })
    expect(ctx.state.logger.logs()[1].log.foo, 'to equal', 'baz')
    expect(ctx.state.logger.logs()[1].meta, 'to satisfy', {
      event: 'includes_inspectable_logger',
      category: 'info',
    })
  })
