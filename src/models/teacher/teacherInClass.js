const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')

const SchoolClass = require('../class/schoolClass')
const Classroom = require('../class/classroom')
const TeacherInSchool = require('./teacherInSchool')

class TeacherInClass extends Model {
}

TeacherInClass.init({}, {sequelize, modelName: 'teacherInClass', timestamps: false})

TeacherInClass.belongsTo(TeacherInSchool, {foreignKey: {allowNull: false}})
TeacherInSchool.hasMany(TeacherInClass)

TeacherInClass.belongsTo(SchoolClass, {foreignKey: {allowNull: false}})
SchoolClass.hasMany(TeacherInClass)

TeacherInClass.belongsTo(Classroom)
Classroom.hasMany(TeacherInClass)

module.exports = TeacherInClass