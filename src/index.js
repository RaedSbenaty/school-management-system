const app = require('./app')
const sequelize = require('./db/sequelize')
const Class = require('./models/class/class')
const Category = require('./models/subject/category')
const ExamType = require('./models/subject/examType')


const runServer = async () => {
    await sequelize.authenticate()
   await sequelize.sync({force: true})
  //  await sequelize.sync()
    await Class.defaultClasses.forEach(myClass => Class.create(myClass))
    await Category.defaultCategories.forEach(myCategory => Category.create(myCategory))
    await ExamType.defaultExamTypes.forEach(type => ExamType.create(type))
    app.listen(process.env.PORT, () => console.log(`Server is up at port: ${process.env.PORT}`))
}

runServer()

