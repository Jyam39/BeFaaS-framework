const lib = require('../../lib/')

module.exports = lib.serverless(router => {
  router.get('/', (ctx, next) => {
    ctx.body = { message: 'Hello World from test!' }
  })

  router.get('/call/:provider', async (ctx, next) => {
    ctx.body = await lib.call(ctx.params.provider, 'test2')
  })

  router.post('/call', async (ctx, next) => {
    console.log(ctx.request.body)
    ctx.body = { ok: true, from: 'test' }
  })
})
