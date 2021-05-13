var app = require('./app')
var sequelize = require('./db/sequelize')
var Class = require('./models/class')

var runServer = async () => {
    await sequelize.authenticate()
    await sequelize.sync({force: true})
    await Class.defaultClasses.forEach(myClass => Class.create(myClass))
    app.listen(process.env.PORT, () => console.log(`Server is up at port: ${process.env.PORT}`))
}

runServer()

