const xss = require('xss')
const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, pwd) => {
    username = escape(username)

    // 生成加密密码
    pwd = genPassword(pwd)
    pwd = escape(pwd)

    const sql = `
        select id, username, nickname from users
        where username=${username} and pwd=${pwd}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}

const register = async (userInfo) => {
    let { username, nickname, pwd } = userInfo

    pwd = genPassword(pwd)
    username = escape(username)
    nickname = escape(nickname)
    pwd = escape(pwd)

    const createTime = Date.now()

    const queryUserSql = `
        select * from users
        where username=${username}
    `
    const rows = await exec(queryUserSql)
    if (rows.length !== 0) throw new Error('这个用户名已被占用！')
  
    const sql = `
        insert into users (username, nickname, pwd, createTime)
        values (${username}, ${nickname}, ${pwd}, '${createTime}');
    `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

const logout = async () => {
    return '注销成功'
}

module.exports = {
    login,
    register,
    logout
}
