const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const SubjectInSemester = require('../subject/subjectInSemester')
const ExamType = require('./examType')

class Exam extends Model {

}

Exam.init({
    fullMark: {type: DataTypes.INTEGER, allowNull: false},
    dateOfExam: {type: DataTypes.DATE, allowNull: false}
}, {sequelize, modelName: 'exam', timestamps: false})

Exam.belongsTo(ExamType, {foreignKey: {allowNull: false}})
ExamType.hasMany(Exam)

Exam.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(Exam)

module.exports = Exam