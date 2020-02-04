const router = require('koa-router')()

const {
  getList,
  saveVideo,
  uploadVideo,
  getOneVideo
} = require('../controller/video')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/video')

router.get('/list', async function (ctx, next) {
  let author = ctx.query.author || ''
  const keyword = ctx.query.keyword || ''

  const listData = await getList(author, keyword)
  ctx.body = new SuccessModel(listData)
})

router.get('/oneVideo', async function (ctx, next) {
  let id = ctx.query.id || ''
  try {
    const data = await getOneVideo(id)
    ctx.body = new SuccessModel(data, '获取视频资源成功')
  } catch (e) {
    ctx.body = new ErrorModel(e.message)
  }
})

router.post('/save', loginCheck, async function (ctx, next) {
  try {
    const body = ctx.request.body
    const userId = ctx.request.body.userId

    const data = await saveVideo(body, userId)
    ctx.body = new SuccessModel(data)
  } catch (e) {
    ctx.body = new ErrorModel(e.message)
  }
})

router.post('/upload', async function (ctx, next) {
  try {
    // 上传单个文件
    const file = ctx.request.files.file // 获取上传文件

    const data = await uploadVideo(file)
    ctx.body = new SuccessModel(data, '上传成功')
  } catch (e) {
    ctx.body = new ErrorModel(e.message)
  }
})

module.exports = router
