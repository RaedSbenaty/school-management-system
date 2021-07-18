const express = require('express')
const app = express()

app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization')
    next()
})

app.use(require('./routers/general'))
app.use(require('./routers/teacher'))
app.use(require('./routers/student'))
app.use(require('./routers/upload'))

app.use(require('./routers/school/school'))
app.use(require('./routers/school/class'))
app.use(require('./routers/school/classroom'))
app.use(require('./routers/school/student'))
app.use(require('./routers/school/subject'))
app.use(require('./routers/school/teacher'))
app.use(require('./routers/school/mark'))
app.use(require('./routers/school/session'))
app.use(require('./routers/school/examSchedule'))

module.exports = app
