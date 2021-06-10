const sequelize = require('../../db/sequelize')
const {Model} = require('sequelize')

const School = require('../school')
const Student = require('./student')

class StudentInSchool extends Model {
    static async getStudents(schoolId, startYear, endYear, className, classroomNumber) {
        const where = {
            schoolId,
            '$studentInClasses.schoolClass.startYear$': startYear,
            '$studentInClasses.schoolClass.endYear$': endYear
        }

        if (className) where['$studentInClasses.schoolClass.class.name$'] = className
        if (classroomNumber) where['$studentInClasses.classroom.classroomNumber$'] = classroomNumber

        return await StudentInSchool.findAll({
            where,
            include: [{association: 'student', include: ['personalInfo', 'account']},
                {
                    association: 'studentInClasses', attributes: ['id'],
                    include: ['classroom', {association: 'schoolClass', include: 'class'}]
                }]
        })
    }

    static async handleGetStudentsRequest(req, res) {
        try {
            let className
            if (req.params.className) className = req.params.className.replace('_', ' ')
            const students = await StudentInSchool.getStudents(req.account.school.id, req.params.startYear,
                req.params.endYear, className, req.params.classroomNumber)
            res.send({students})
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
}

StudentInSchool.init({}, {sequelize, modelName: 'studentInSchool', timestamps: false})

StudentInSchool.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(StudentInSchool)

StudentInSchool.belongsTo(Student, {foreignKey: {allowNull: false}})
Student.hasMany(StudentInSchool)

module.exports = StudentInSchool