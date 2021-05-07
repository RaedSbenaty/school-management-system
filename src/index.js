var app = require('./app')
var sequelize = require('./db/sequelize')

var runDataBaseServer = async () => {
   await sequelize.authenticate()
   await sequelize.sync({ force: true })
}

    runDataBaseServer()

app.listen(process.env.PORT, () => console.log(`Server is up at port: ${process.env.PORT}`))