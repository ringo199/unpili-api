const router = require('koa-router')()
const { login, register } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { username, pwd } = ctx.request.body
    const data = await login(username, pwd)
    if (data.username) {
        // 设置 session
        ctx.session.username = data.username
        ctx.session.nickname = data.nickname

        ctx.body = new SuccessModel()
        return
    }
    ctx.body = new ErrorModel('登录失败')
    console.log('login', ctx.body);
    
})

router.post('/register', async function (ctx, next) {
    const body = ctx.request.body

    const data = await register(body)
    ctx.body = new SuccessModel(data)
})

// router.get('/session-test', async function (ctx, next) {
//   if (ctx.session.viewCount == null) {
//     ctx.session.viewCount = 0
//   }
//   ctx.session.viewCount++

//   ctx.body ={
//     errno: 0,
//     viewCount: ctx.session.viewCount
//   }
// })

module.exports = router