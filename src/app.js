var express = require('express')
var app = express()

var generalRouter = require('./routers/general')
var teacherRouter = require('./routers/teacher')
var studentRouter = require('./routers/student')
var schoolRouter = require('./routers/school')

app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    next()
})

app.use(generalRouter)
app.use(teacherRouter)
app.use(studentRouter)
app.use(schoolRouter)

module.exports = app
