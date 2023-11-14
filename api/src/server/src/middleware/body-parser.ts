import koaBodyParser from 'koa-bodyparser'

export const bodyParser = () => koaBodyParser({
  onerror: (err, ctx) => {
    ctx.state.logger.emit('bodyparser_error', 'error', err)
    ctx.throw(422, 'unable to parse the body')
  },
})

export default bodyParser
