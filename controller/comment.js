const xss = require('xss')
const { exec } = require('../db/mysql')
const { ListModel } = require('../model/listModel')

const getCommentList = async (videoId) => {
  let sql = `
    select comments.id, content,
    comments.createTime as datetime,
    users.avatar,
    users.nickname as author
    from comments
    left join users on users.id = comments.commentUser
    where commentVideo=${videoId}
    order by comments.createTime desc;
  `

  const rows = await exec(sql)
  return new ListModel({
    rows,
    pageNo: 1,
    pageSize: 10,
    total: 1
  })
}

const getCommentDetail = async () => {

}

const saveComment =  async ({ content, videoId }, userId) => {
  content = xss(content)
  const commentVideo = xss(videoId)
  const commentUser = userId
  const createTime = Date.now()

  const sql = `
      insert into comments (content, parentComment, commentVideo, commentUser, createTime)
      values ('${content}', 'null', '${commentVideo}', '${commentUser}', '${createTime}');
  `
  const insertData = await exec(sql)
  return {
      id: insertData.insertId
  }
}

module.exports = {
  getCommentList,
  getCommentDetail,
  saveComment
}
