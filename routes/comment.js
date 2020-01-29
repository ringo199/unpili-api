const router = require('koa-router')()

const {
  getCommentList,
  getCommentDetail,
  saveComment
} = require('../controller/comment')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/comment')

router.get('/list', async function (ctx, next) {
  try {
    let videoId = ctx.query.videoId || ''
    let pageNo = ctx.query.pageNo || 1
    let pageSize = ctx.query.pageSize || 10

    const listData = await getCommentList(videoId, pageNo, pageSize)
    ctx.body = new SuccessModel(listData)
  } catch (e) {
    ctx.body = new ErrorModel(e.message)
  }
})

router.get('/detail', async function (ctx, next) {
  try {
    let commentId = ctx.query.commentId || ''
    let pageNo = ctx.query.pageNo || 1
    let pageSize = ctx.query.pageSize || 10

    const listData = await getCommentDetail(commentId, pageNo, pageSize)
    ctx.body = new SuccessModel(listData)
  } catch (e) {
    ctx.body = new ErrorModel(e.message)
  }
})

router.post('/save', loginCheck, async function (ctx, next) {
  try {
    const body = ctx.request.body
    const userId = ctx.session.userId    

    const data = await saveComment(body, userId)
    ctx.body = new SuccessModel(data)
  } catch (e) {
    ctx.body = new ErrorModel(e.message)
  }
})

module.exports = router
