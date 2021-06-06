const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const SubjectInSemester = require('./subjectInSemester')
const ExamType = require('./examType')
const StudentInClass = require('../student/studentInClass')

class Mark extends Model {
}

Mark.init({
    value: {
        type: DataTypes.INTEGER, allowNull: false,
        validate: {
            notHigherThanFullMarks(value) {
                if(value < 0 || value > this.fullMarks)
                    throw new Error('Mark can\'nt be higher than full marks.')
            }
        }
    },
    fullMarks: {type: DataTypes.INTEGER, allowNull: false}
}, {sequelize, modelName: 'Exams', timestamps: false})

Mark.belongsTo(ExamType,{foreignKey: {allowNull: false}})
ExamType.hasMany(Mark)

Mark.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(Mark)

Mark.belongsTo(StudentInClass, {foreignKey: {allowNull: false}})
StudentInClass.hasMany(Mark)

module.exports = Mark



