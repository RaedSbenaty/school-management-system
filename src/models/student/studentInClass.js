const sequelize = require('../../db/sequelize')
const {Model} = require('sequelize')

const SchoolClass = require('../class/schoolClass')
const Classroom = require('../class/classroom')
const StudentInSchool = require('./studentInSchool')

class StudentInClass extends Model {
    static async getStudent(schoolId, startYear, endYear, className, classroomNumber) {

    }
}

StudentInClass.init({}, {sequelize, modelName: 'studentInClass', timestamps: false})

StudentInClass.belongsTo(StudentInSchool, {foreignKey: {allowNull: false}})
StudentInSchool.hasMany(StudentInClass)

StudentInClass.belongsTo(SchoolClass, {foreignKey: {allowNull: false}})
SchoolClass.hasMany(StudentInClass)

StudentInClass.belongsTo(Classroom)
Classroom.hasMany(StudentInClass)

module.exports = StudentInClass