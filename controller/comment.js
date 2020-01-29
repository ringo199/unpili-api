const xss = require('xss')
const { exec } = require('../db/mysql')
const { ListModel } = require('../model/listModel')

const getCommentList = async (videoId, pageNo, pageSize) => {
  let sql = `set @commentNo=${(pageNo - 1) * pageSize};`
  await exec(sql)
  sql = `SELECT COUNT(*) FROM comments where commentVideo=${videoId};`
  let total = await exec(sql)
  total = total[0]['COUNT(*)']
  sql = `
    select @commentNo:=@commentNo+1 as commentNo,
    content, comments.id,
    comments.createTime as datetime,
    users.avatar,
    users.nickname as author
    from comments
    left join users on users.id = comments.commentUser
    where commentVideo=${videoId}
    order by comments.createTime asc
    limit ${(pageNo - 1) * pageSize}, ${pageSize};
  `

  const rows = await exec(sql)

  for (let i = 0, num = rows.length; i < num; i++) {
    sql = `SELECT COUNT(*) FROM comments where parentComment=${rows[i].id};`
    let replyTotal = await exec(sql)
    replyTotal = replyTotal[0]['COUNT(*)']
    rows[i].replyTotal = replyTotal
  }

  return new ListModel({
    rows,
    pageNo,
    pageSize,
    total
  })
}

const getCommentDetail = async (commentId, pageNo, pageSize) => {
  // 重置评论楼层(伪)
  let sql = `set @commentNo=${(pageNo - 1) * pageSize};`
  await exec(sql)
  // 查询评论总数
  sql = `SELECT COUNT(*) FROM comments where parentComment=${commentId};`
  let total = await exec(sql)
  total = total[0]['COUNT(*)']
  // 获取评论详细数据
  sql = `
    select @commentNo:=@commentNo+1 as commentNo,
    content,
    comments.createTime as datetime,
    users.avatar,
    users.nickname as author
    from comments
    left join users on users.id = comments.commentUser
    where parentComment=${commentId}
    order by comments.createTime asc
    limit ${(pageNo - 1) * pageSize}, ${pageSize};
  `

  const rows = await exec(sql)

  return new ListModel({
    rows,
    pageNo,
    pageSize,
    total
  })
}

const saveComment =  async ({ content, videoId, parentCommentId }, userId) => {
  content = xss(content)
  const parentComment = xss(parentCommentId) || null
  const commentVideo = xss(videoId)
  const commentUser = userId
  const createTime = Date.now()

  const sql = `
      insert into comments (content, parentComment, commentVideo, commentUser, createTime)
      values ('${content}', '${parentComment}', '${commentVideo}', '${commentUser}', '${createTime}');
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
