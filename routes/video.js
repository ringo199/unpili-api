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

  const { code, data, message } = await getOneVideo(id)
  if (code === 0) {
    ctx.body = new SuccessModel(data, message)
  } else {
    ctx.body = new ErrorModel(data, message)
  }
})

router.post('/save', loginCheck, async function (ctx, next) {
  const body = ctx.request.body
  const username = ctx.session.username

  const data = await saveVideo(body, username)
  ctx.body = new SuccessModel(data)
})

router.post('/upload', async function (ctx, next) {
  // 上传单个文件
  const file = ctx.request.files.file // 获取上传文件

  const { code, data, message } = await uploadVideo(file)
  if (code === 0) {
    ctx.body = new SuccessModel(data, message)
  } else {
    ctx.body = new ErrorModel(data, message)
  }
})

module.exports = router
