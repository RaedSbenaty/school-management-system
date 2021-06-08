const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const SubjectInSemester = require('./subjectInSemester')
const ExamType = require('./examType')

class Exam extends Model {

}

Exam.init({
    fullMarks: {type: DataTypes.INTEGER, allowNull: false},
}, {sequelize, modelName: 'exam', updatedAt: false})

Exam.belongsTo(ExamType, {foreignKey: {allowNull: false}})
ExamType.hasMany(Exam)

Exam.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(Exam)

module.exports = Exam