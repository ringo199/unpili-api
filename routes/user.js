const router = require('koa-router')()
const { login, register, logout, getInfo, updateInfo } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')
const { SECRET } = require('../conf/constant')
const jwt = require('jsonwebtoken')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { username, pwd } = ctx.request.body
    try {
        const data = await login(username, pwd)
        const tokenVer = (ctx.session.tokenVer || 0) + 0.1
        if (data.userId) {
            const token = jwt.sign({ ...data, ver: tokenVer }, SECRET, { expiresIn: 24 * 3600 })
            // 设置 token版本
            ctx.session.tokenVer = tokenVer

            ctx.body = new SuccessModel({ token }, '登录成功')        
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

        ctx.session.tokenVer = ctx.session.tokenVer + 0.1

        const message = await logout(body)
        ctx.body = new SuccessModel(message)
    } catch (e) {
        ctx.body = new ErrorModel(e.message)
    }
})

router.post('/getInfo', loginCheck, async function (ctx, next) {
    try {
        const userId = ctx.request.body.userId

        const data = await getInfo(userId)
        ctx.body = new SuccessModel(data, '获取用户信息成功')
    } catch (e) {
        ctx.body = new ErrorModel(e.message)
    }
})

router.post('/updateInfo', loginCheck, async function (ctx, next) {
    try {
        const body = ctx.request.body
        const userId = ctx.request.body.userId

        await updateInfo(body, userId)
        ctx.body = new SuccessModel('更新用户信息成功')
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