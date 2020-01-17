const { NoLoginErrorMadel } = require('../model/resModel')

module.exports = async (ctx, next) => {
    if (ctx.session.username) {
        await next()
        return
    }
    ctx.body = new NoLoginErrorMadel('请先登录！')
}
