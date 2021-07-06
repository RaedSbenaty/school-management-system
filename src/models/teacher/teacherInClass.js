const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')

const SchoolClass = require('../class/schoolClass')
const TeacherInSchool = require('./teacherInSchool')

class TeacherInClass extends Model {
}

TeacherInClass.init({}, {sequelize, modelName: 'teacherInClass', updatedAt: false})

TeacherInClass.belongsTo(TeacherInSchool, {foreignKey: {allowNull: false}})
TeacherInSchool.hasMany(TeacherInClass)

TeacherInClass.belongsTo(SchoolClass, {foreignKey: {allowNull: false}})
SchoolClass.hasMany(TeacherInClass)

module.exports = TeacherInClass