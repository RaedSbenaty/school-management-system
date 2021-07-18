const app = require('./app')
const sequelize = require('./db/sequelize')

const Class = require('./models/class/class')
const Category = require('./models/subject/category')
const ExamType = require('./models/subject/examType')
const Day = require('./models/day')
const AnnouncementType = require('./models/announcement/announcementType')


const runServer = async () => {
    await sequelize.authenticate()
<<<<<<< HEAD
    //await sequelize.sync({force: true})
=======
    //  await sequelize.sync({force: true})
>>>>>>> 8fb205134425a4292b4824f9c0f22979bf14dad7
    await sequelize.sync()
    await Class.bulkCreate(Class.defaultClasses)
    await Category.bulkCreate(Category.defaultCategories)
    await ExamType.bulkCreate(ExamType.defaultExamTypes)
    await Day.bulkCreate(Day.defaultDays)
    await AnnouncementType.bulkCreate(AnnouncementType.defaultAnnouncementTypes)
    app.listen(process.env.PORT, () => console.log(`Server is up at port: ${process.env.PORT}`))
}

runServer()