var sequelize = require('../db/sequelize')
var {DataTypes, Model} = require('sequelize')
var School = require('./school')
var Student = require('./student')

class StudentInSchool extends Model {

}

StudentInSchool.init({}
    , {sequelize, modelName: 'studentInSchool', timestamps: false})

StudentInSchool.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(StudentInSchool)

StudentInSchool.belongsTo(Student, {foreignKey: {allowNull: false}})
Student.hasMany(StudentInSchool)

module.exports = StudentInSchool