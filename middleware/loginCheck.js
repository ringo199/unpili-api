const { NoLoginErrorMadel, ErrorModel } = require('../model/resModel')
const { SECRET } = require('../conf/constant')
const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
    const token = (ctx.request.body && ctx.request.body.access_token) ||
        (ctx.request.query && ctx.request.query.access_token) ||
        ctx.request.header['x-access-token']
    if (token) {
        try {
            const decode = await jwt.verify(token, SECRET);

            if (ctx.session.tokenVer !== decode.ver) {
                throw new Error('token过于陈旧，请重新获取！')
            }

            // console.log('ctx.session.tokenVer', ctx.session.tokenVer);
            // console.log('decode.ver', decode.ver);

            if (ctx.request.method === 'POST') {
                ctx.request.body.userId = decode.userId
                ctx.request.body.username = decode.username
                ctx.request.body.nickname = decode.nickname
            } else if (ctx.request.method === 'GET') {
                ctx.request.query.userId = decode.userId
                ctx.request.query.username = decode.username
                ctx.request.query.nickname = decode.nickname
            }
            await next()
            return
        } catch (e) {
            ctx.body = new ErrorModel(e.message)
        }
    } else {
        ctx.body = new NoLoginErrorMadel('请先登录！')
    }
}
