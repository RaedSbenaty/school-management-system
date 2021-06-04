var app = require('./app')
var sequelize = require('./db/sequelize')
var Class = require('./models/class')
var Category = require('./models/category')

var runServer = async () => {
    await sequelize.authenticate()
//      await sequelize.sync({force: true})
    await sequelize.sync()
    await Class.defaultClasses.forEach(myClass => Class.create(myClass))
    await Category.defaultCategories.forEach(myCategory => Category.create(myCategory))
    app.listen(process.env.PORT, () => console.log(`Server is up at port: ${process.env.PORT}`))
}

runServer()

