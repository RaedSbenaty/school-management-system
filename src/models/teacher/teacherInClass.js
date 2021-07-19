const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')

const SchoolClass = require('../class/schoolClass')
const Classroom = require('../class/classroom')
const TeacherInYear = require('./teacherInYear')

class TeacherInClass extends Model {
}

TeacherInClass.init({}, {sequelize, modelName: 'teacherInClass', timestamps: false})

TeacherInClass.belongsTo(TeacherInYear, {foreignKey: {allowNull: false}})
TeacherInYear.hasMany(TeacherInClass)

TeacherInClass.belongsTo(SchoolClass, {foreignKey: {allowNull: false}})
SchoolClass.hasMany(TeacherInClass)


module.exports = TeacherInClass