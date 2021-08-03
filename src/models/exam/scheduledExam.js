const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const SubjectInSemester = require('../subject/subjectInSemester')

class ScheduledExam extends Model {
}

ScheduledExam.init({
    date: {type: DataTypes.DATE, allowNull: false},
    startTime: {type: DataTypes.STRING, allowNull: false},
    endTime: {type: DataTypes.STRING, allowNull: false},
}, {sequelize, modelName: 'scheduledExam', timestamps: false})


ScheduledExam.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(ScheduledExam)

module.exports = ScheduledExam