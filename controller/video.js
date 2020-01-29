const xss = require('xss')
const { exec } = require('../db/mysql')
const { ListModel } = require('../model/listModel')
const path = require('path')
const fs = require('fs')
const { genFileName } = require('../utils/cryp')

const env = process.env.NODE_ENV

const getList = async (username, keyword) => {
    let sql = `select * from videos where 1=1 `
    if (username) {
        sql += `and createUser='${username}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createTime desc;`
    const rows = await exec(sql)
    return new ListModel({
      rows,
      pageNo: 1,
      pageSize: 10,
      total: 1
    })
}

const getOneVideo = async (id) => {
  let sql = `
    select videos.id, title, cover, url, videos.createTime,
    avatar as createAvatar,
    description as createDescription,
    users.id as createUserId,
    nickname as createNickname
    from videos
    left join users on users.id = videos.createUser
    where videos.id='${id}'
    order by videos.createTime desc;
  `
  try {
    const [ data ] = await exec(sql)
    return data
  } catch (e) {
    throw new Error(e.message)
  }
}

const saveVideo =  async (VideoData = {}, userId) => {
  // VideoData 是一个视频对象，包含 title cover url 属性
  const title = xss(VideoData.title)
  // console.log('title is', title)
  const cover = xss(VideoData.cover)
  const url = xss(VideoData.url)
  const createUser = userId
  const createTime = Date.now()

  const sql = `
      insert into videos (title, cover, url, createUser, createTime)
      values ('${title}', '${cover}', '${url}', '${createUser}', '${createTime}');
  `

  const insertData = await exec(sql)
  return {
      id: insertData.insertId
  }
}

const uploadVideo = async (file) => {
  try {
    // 创建可读流
    const reader = fs.createReadStream(file.path)
    let fileNameArr = file.name.split('.')
    let fileType = fileNameArr[fileNameArr.length - 1]
    const fileName = genFileName(file.name) + '.' + fileType
    let filePath
    if (env === 'dev') {
      filePath = path.join(__dirname, '../public') + `/${fileName}`
    } else {
      filePath = path.join('/home/file') + `/${fileName}`
    }
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    if (env === 'dev') {
      return { path: `http://127.0.0.1:8099/file/${fileName}` }
    } else {
      return { path: `http://118.190.36.141/file/${fileName}` }
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = {
  getList,
  saveVideo,
  uploadVideo,
  getOneVideo
}
