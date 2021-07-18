const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')

const SchoolClass = require('../class/schoolClass')
const Classroom = require('../class/classroom')
const StudentInSchool = require('./studentInSchool')

class StudentInClass extends Model {
    static async getStudentInClass(studentId, schoolId, startYear, endYear) {
        return await StudentInClass.findOne({
            subQuery: false, attributes: ['id', 'schoolClassId', 'classroomId'],
            include: [{association: 'classroom', attributes: []}, {
                attributes: [], association: 'schoolClass', where: {startYear, endYear}
            }, {association: 'studentInSchool', where: {studentId, schoolId}}]
        })
    }
}

StudentInClass.init({}, {sequelize, modelName: 'studentInClass', updatedAt: false})

StudentInClass.belongsTo(StudentInSchool, {foreignKey: {allowNull: false}})
StudentInSchool.hasMany(StudentInClass)

StudentInClass.belongsTo(SchoolClass, {foreignKey: {allowNull: false}})
SchoolClass.hasMany(StudentInClass)

StudentInClass.belongsTo(Classroom)
Classroom.hasMany(StudentInClass)

module.exports = StudentInClass