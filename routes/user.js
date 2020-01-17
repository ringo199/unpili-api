const router = require('koa-router')()
const { login, register, logout, getInfo } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { username, pwd } = ctx.request.body
    try {
        const data = await login(username, pwd)
        if (data.username) {
            // 设置 session
            ctx.session.userId = data.id
            ctx.session.username = data.username

            ctx.body = new SuccessModel({ ...data }, '登录成功')        
        }
    } catch (e) {
        ctx.body = new ErrorModel(e.message)
    }
})

router.post('/register', async function (ctx, next) {
    try {
        const body = ctx.request.body

        const data = await register(body)
        ctx.body = new SuccessModel({ ...data }, '注册成功')
    } catch (e) {
        ctx.body = new ErrorModel(e.message)
    }
})

router.post('/logout', loginCheck, async function (ctx, next) {
    try {
        const body = ctx.request.body

        ctx.session.userId = null
        ctx.session.username = null

        const message = await logout(body)
        ctx.body = new SuccessModel(message)
    } catch (e) {
        ctx.body = new ErrorModel(e.message)
    }
})

router.post('/getInfo', loginCheck, async function (ctx, next) {
    try {
        const userId = ctx.session.userId

        const data = await getInfo(userId)
        ctx.body = new SuccessModel(data, '获取用户信息成功')
    } catch (e) {
        ctx.body = new ErrorModel(e.message)
    }
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