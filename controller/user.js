const xss = require('xss')
const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = async (username, pwd) => {
    username = escape(username)

    // 生成加密密码
    pwd = genPassword(pwd)
    pwd = escape(pwd)

    const sql = `
        select username, nickname from users
        where username=${username} and pwd=${pwd}
    `
    console.log('sql', sql);

    const rows = await exec(sql)
    console.log('rows', rows);
    return rows[0] || {}
}

const register = async (userInfo) => {
    let { username, nickname, pwd } = userInfo

    pwd = genPassword(pwd)
    username = escape(username)
    nickname = escape(nickname)
    pwd = escape(pwd)

    const createTime = Date.now()
  
    const sql = `
        insert into users (username, nickname, pwd, createTime)
        values (${username}, ${nickname}, ${pwd}, '${createTime}');
    `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
}

module.exports = {
    login,
    register
}
