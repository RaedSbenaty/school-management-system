const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const SubjectInSemester = require('./subjectInSemester')
const ExamType = require('./examType')
const StudentInSchool = require('../student/studentInSchool')
const StudentInClass = require('../student/studentInClass')

class Mark extends Model {
    static async getStudentsMarks(schoolId, startYear, endYear, className, classroomNumber) {
        const students = await StudentInSchool.getStudents(schoolId, startYear, endYear, className, classroomNumber)
        for (const student of students) {
            student.studentInClasses[0].dataValues.marks = await (await student.getStudentInClasses())[0].getMarks()
        }
        return students
    }

    static async handleGetMarksRequest(req, res) {
        try {
            let className
            if (req.params.className) className = req.params.className.replace('_', ' ')
            const students = await Mark.getStudentsMarks(req.account.school.id, req.params.startYear,
                req.params.endYear, className, req.params.classroomNumber)
            res.send({students})
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
}

Mark.init({
    value: {
        type: DataTypes.INTEGER, allowNull: false,
        validate: {
            notHigherThanFullMarks(value) {
                if (value < 0 || value > this.fullMarks)
                    throw new Error('Mark can\'nt be higher than full marks.')
            }
        }
    },
    fullMarks: {type: DataTypes.INTEGER, allowNull: false}
}, {sequelize, modelName: 'mark', timestamps: false})

Mark.belongsTo(ExamType, {foreignKey: {allowNull: false}})
ExamType.hasMany(Mark)

Mark.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(Mark)


Mark.belongsTo(StudentInClass, {foreignKey: {allowNull: false}})
StudentInClass.hasMany(Mark)

module.exports = Mark



