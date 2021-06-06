const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const SubjectInSemester = require('./subjectInSemester')
const StudentInClass = require('../student/studentInClass')

class Exam extends Model {
}

Exam.init({
    mark: {type: DataTypes.INTEGER, allowNull: false},
    fullMarks: {type: DataTypes.INTEGER, allowNull: false}
}, {sequelize, modelName: 'Exams', timestamps: false})



Exam.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(Exam)

Exam.belongsTo(StudentInClass, {foreignKey: {allowNull: false}})
StudentInClass.hasMany(Exam)

module.exports = Exam



