const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const ScheduledExam = require('./scheduledExam')

class ExamSchedule extends Model {
}

ExamSchedule.init({
    scheduleType:{type: DataTypes.ENUM('Classroom', 'Class')}
}, {sequelize, modelName: 'examSchedule', timestamps: false})

ExamSchedule.hasMany(ScheduledExam)
ScheduledExam.belongsTo(ExamSchedule)

module.exports = ExamSchedule