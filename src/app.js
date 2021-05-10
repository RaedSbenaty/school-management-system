var path = require('path')
var express = require('express')
var app = express()

var publicPath = path.join(__dirname, '../public')
var teacherRouter = require('./routers/teacher')
var studentRouter = require('./routers/student')
var schoolRouter = require('./routers/school')
var accountRouter = require('./routers/account')

app.use(express.static(publicPath))
app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

    next()
})
app.use(teacherRouter)
app.use(studentRouter)
app.use(schoolRouter)
app.use(accountRouter)

module.exports = app
