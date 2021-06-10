var sequelize = require('../db/sequelize')
var {DataTypes, Model} = require('sequelize')
var School = require('./school')
var Teacher = require('./teacher')

class TeacherInSchool extends Model {

}

TeacherInSchool.init({}
    , {sequelize, modelName: 'teacherInSchool', timestamps: false})

TeacherInSchool.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(TeacherInSchool)

TeacherInSchool.belongsTo(Teacher, {foreignKey: {allowNull: false}})
Teacher.hasMany(TeacherInSchool)

module.exports = TeacherInSchool