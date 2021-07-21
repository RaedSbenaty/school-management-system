const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const Session = require('./session')
const StudentInClass = require('../student/studentInClass')
const TeacherInYear = require('../teacher/teacherInYear')


class Absence extends Model {
    static async getAbsences(startYear, endYear) {
        const absences = await Absence.findAll({
            attributes: {exclude:['id','sessionId']}, include: [
                {
                    association: 'studentInClass', attributes: ['id'], include: [
                        {
                            association: 'studentInSchool', attributes: ['id'], include: {
                                association: 'student', attributes: ['id'],
                                include: {association: 'personalInfo', attributes: ['firstName', 'lastName']}
                            }
                        },
                        {association: 'schoolClass', attributes: [], required: false, where: {startYear, endYear}}
                    ]
                },
                {
                    association: 'teacherInYear', attributes: ['id'], where: {startYear, endYear}, required: false,
                    include: {
                        association: 'teacherInSchool', attributes: ['id'], include: {
                            association: 'teacher', attributes: ['id'],
                            include: {association: 'personalInfo', attributes: ['firstName', 'lastName']}
                        }
                    }
                }
            ]
        })
        for (const absence of absences) {
            if (absence.teacherInYearId)
                absence.dataValues.teacher = absence.teacherInYear.teacherInSchool.teacher
            else if (absence.studentInClassId)
                absence.dataValues.student = absence.studentInClass.studentInSchool.student

            delete absence.dataValues.teacherInYear
            delete absence.dataValues.studentInClass
        }
        return absences
    }

}

Absence.init({
    date: {type: DataTypes.DATE, allowNull: false},
    reason: {type: DataTypes.STRING}
}, {sequelize, modelName: 'absence', timestamps: false})


Absence.belongsTo(Session)
Session.hasMany(Absence)

Absence.belongsTo(StudentInClass)
StudentInClass.hasMany(Absence)

Absence.belongsTo(TeacherInYear)
TeacherInYear.hasMany(Absence)

Absence.beforeBulkCreate(absences => {
    absences.forEach(absence => {
        let absents = 0
        if (absence.studentInClassId) absents++
        if (absence.teacherInYearId) absents++
        if (absents !== 1) throw new Error('Just one absent allowed.')
    })
})


module.exports = Absence