const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

class ExamType extends Model {
}

ExamType.init({
    name: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'examType.js', timestamps: false})

ExamType.defaultExamTypes = [
    {name: "Quiz"}, {name: "Test"}, {name: "Midterm Exam"}
    , {name: "Final Exam"}, {name: "Other"},
]

module.exports = ExamType