const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const Classroom = require('../class/classroom')
const ExamSchedule = require('./examSchedule')

class ClassroomExamSchedule extends Model {
}

ClassroomExamSchedule.init({
   
}, {sequelize, modelName: 'classroomExamSchedule', timestamps: false})


ClassroomExamSchedule.belongsTo(Classroom, {foreignKey: {allowNull: false}})
Classroom.hasMany(ClassroomExamSchedule)

ClassroomExamSchedule.belongsTo(ExamSchedule, {foreignKey: {allowNull: false}})
ExamSchedule.hasMany(ClassroomExamSchedule)

Classroom.belongsToMany(ExamSchedule, {through: ClassroomExamSchedule})
ExamSchedule.belongsToMany(Classroom, {through: ClassroomExamSchedule})

module.exports = ClassroomExamSchedule