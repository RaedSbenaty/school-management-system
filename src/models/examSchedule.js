const {DataTypes, Model} = require('sequelize')
const sequelize = require('../db/sequelize')
const SubjectInSemester = require('./subject/subjectInSemester')

class ExamSchedule extends Model {
}

ExamSchedule.init({
    dateOfExam: {type: DataTypes.DATE, allowNull: false},
    startTime: {type: DataTypes.STRING, allowNull: false},
    endTime: {type: DataTypes.STRING, allowNull: false},
}, {sequelize, modelName: 'examSchedule', timestamps: false})


ExamSchedule.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(ExamSchedule)

module.exports = ExamSchedule