var sequelize = require('../db/sequelize')
var {DataTypes, Model} = require('sequelize')

var Class = require('./class')
var SchoolClass = require('./SchoolClass')
var Classroom = require('./classroom')
var StudentInSchool = require('./studentInSchool')

class StudentInClass extends Model {
}

StudentInClass.init({}, {sequelize, modelName: 'studentInClass', timestamps: false})


StudentInClass.belongsTo(StudentInSchool, {foreignKey: {allowNull: false}})
StudentInSchool.hasMany(StudentInClass)

StudentInClass.belongsTo(SchoolClass, {foreignKey: {allowNull: false}})
SchoolClass.hasMany(StudentInClass)

StudentInClass.belongsTo(Classroom)
Classroom.hasMany(StudentInClass)

module.exports = StudentInClass