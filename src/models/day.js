const {DataTypes, Model, Op} = require('sequelize')
const sequelize = require('../db/sequelize')

class Day extends Model {
    static async getScheduleForClassroomInSemester(classroomId, semester) {
        const schedule = await Day.findAll({
            attributes: ['name'], include: {
                association: 'sessions', attributes: ['startTime', 'endTime']
                , where: {classroomId: {[Op.and]: [{[Op.eq]: classroomId}, {[Op.not]: null}]}},
                include: [{
                    association: 'subjectInSemester', where: {semester},
                    attributes: ['id'], include: {association: 'subjectInYear', attributes: ['name']}
                }, {
                    association: 'teacherInClass', attributes: ['id'], include: {
                        association: 'teacherInYear', attributes: ['id'], include: {
                            association: 'teacherInSchool', attributes: ['id'], include: {
                                association: 'teacher', attributes: ['id'],
                                include: {association: 'personalInfo', attributes: ['firstName', 'lastName']}
                            }
                        }
                    }
                }]
            }
        })
        for (const day of schedule)
            for (const session of day.sessions) {
                session.dataValues.subjectName = session.subjectInSemester.subjectInYear.name
                delete session.dataValues.subjectInSemester
                session.dataValues.teacher = session.teacherInClass.teacherInYear.teacherInSchool.teacher
                delete session.dataValues.teacherInClass
            }
        return schedule
    }
}

Day.init({
    name: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'day', timestamps: false})

Day.defaultDays = [
    {name: "Saturday"}, {name: "Sunday"}, {name: "Monday"}, {name: "Tuesday"},
    {name: "Wednesday"}, {name: "Thursday"}, {name: "Friday"}
]

module.exports = Day