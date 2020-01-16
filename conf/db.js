const env = process.env.NODE_ENV  // 环境参数

// 配置
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
    // mysql
    MYSQL_CONF = {
        host: '118.190.36.141',
        user: 'root',
        password: 'ringo123',
        port: '3306',
        database: 'unpili'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '118.190.36.141'
    }
}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: 'ringo123',
        port: '3306',
        database: 'unpili'
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}