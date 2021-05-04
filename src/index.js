var app = require('./app')

app.listen(process.env.PORT,()=> console.log(`Server is up at port: ${process.env.PORT}`))