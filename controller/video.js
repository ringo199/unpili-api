const xss = require('xss')
const { exec } = require('../db/mysql')
const { ListModel } = require('../model/listModel')
const path = require('path')
const fs = require('fs')
const { genFileName } = require('../utils/cryp')

const env = process.env.NODE_ENV

const getList = async (author, keyword) => {
    let sql = `select * from videos where 1=1 `
    if (author) {
        sql += `and author='${author}' `
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
  let sql = `select * from videos where id='${id}' `
  // if (author) {
  //     sql += `and id='${id}' `
  // }
  // if (keyword) {
  //     sql += `and title like '%${keyword}%' `
  // }
  sql += `order by createTime desc;`
  const [data] = await exec(sql)

  return {
    code: 0,
    data,
    message: '查询资源成功'
  }
}

const saveVideo =  async (VideoData = {}) => {
  // VideoData 是一个视频对象，包含 title cover url 属性
  const title = xss(VideoData.title)
  // console.log('title is', title)
  const cover = xss(VideoData.cover)
  const url = xss(VideoData.url)
  const createTime = Date.now()

  const sql = `
      insert into videos (title, cover, url, createTime)
      values ('${title}', '${cover}', '${url}', '${createTime}');
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
      path.join(__dirname + '../public') + `/${fileName}`
    }
    if (env === 'production') {
      path.join('/home/file') + `/${fileName}`
    }
    // 创建可写流
    const upStream = fs.createWriteStream(filePath)
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    return {
      code: 0,
      data: { path: `http://118.190.36.141/file/${fileName}` },
      message: '上传成功'
    }
  } catch (e) {
    return {
      code: -1,
      message: e
    }
  }
}

module.exports = {
  getList,
  saveVideo,
  uploadVideo,
  getOneVideo
}
