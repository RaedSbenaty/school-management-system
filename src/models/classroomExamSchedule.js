const {DataTypes, Model} = require('sequelize')
const sequelize = require('../db/sequelize')
const Classroom = require('./class/classroom')
const ExamSchedule = require('./examSchedule')

class ClassroomExamSchedule extends Model {
}

ClassroomExamSchedule.init({
   
}, {sequelize, modelName: 'classroomExamSchedule', timestamps: false})


ClassroomExamSchedule.belongsTo(Classroom, {foreignKey: {allowNull: false}})
Classroom.hasMany(ClassroomExamSchedule)

ClassroomExamSchedule.belongsTo(ExamSchedule, {foreignKey: {allowNull: false}})
ExamSchedule.hasMany(ClassroomExamSchedule)

module.exports = ClassroomExamSchedule