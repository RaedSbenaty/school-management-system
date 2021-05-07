var path = require('path')
var express = require('express')
var app = express()

var publicPath = path.join(__dirname, '../public')
var teacherRouter = require('./routers/teacher')
var studentRouter = require('./routers/student')
var schoolRouter = require('./routers/school')

app.use(express.static(publicPath))
app.use(express.json())
app.use(teacherRouter)
app.use(studentRouter)
app.use(schoolRouter)

module.exports = app
