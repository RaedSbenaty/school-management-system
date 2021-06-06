const sequelize = require('../../db/sequelize')
const {Model} = require('sequelize')

const School = require('../school')
const Student = require('./student')

class StudentInSchool extends Model {
}

StudentInSchool.init({
}, {sequelize, modelName: 'studentInSchool', timestamps: false})

StudentInSchool.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(StudentInSchool)

StudentInSchool.belongsTo(Student, {foreignKey: {allowNull: false}})
Student.hasMany(StudentInSchool)

module.exports = StudentInSchool