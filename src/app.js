var path = require('path')
var express = require('express')
var app = express()

var publicPath = path.join(__dirname, '../public')
var teacherRouter = require('./routers/teacher')

app.use(express.static(publicPath))
app.use(express.json())
app.use(teacherRouter)

module.exports = app
