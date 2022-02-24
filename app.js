/*
 * @Description: 
 * @Author: Li Guangyin
 * @Date: 2022-02-24 10:20:39
 * @LastEditTime: 2022-02-24 19:15:30
 */
const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

// 引入封装的文件
const log4js = require('./utils/log4j')
const index = require('./routes/index')
const users = require('./routes/users')
// 原生引入模式
// const log4js = require('log4js')
// const log = log4js.getLogger()


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))


// logger
app.use(async (ctx, next) => {
  await next()
  // 使用log4js打印
  // log.level = 'debug'
  // log.debug('some debug messages')
  log4js.info(`log output`)
})


// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  log4js.error(`${err.stack}`)
});

module.exports = app
