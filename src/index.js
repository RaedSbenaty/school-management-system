var app = require('./app')
var sequelize = require('./db/sequelize')

var test = async () => {
    await sequelize.sync()
    await require('./models/teacher').create({firstName: 'Raed', lastName: 'Sbenaty'})
    console.log('Done!')
}

test()

app.listen(process.env.PORT, () => console.log(`Server is up at port: ${process.env.PORT}`))