const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const Classroom = require('../class/classroom')
const SubjectInSemester = require('../subject/subjectInSemester')
const TeacherInClass = require('../teacher/teacherInClass')
const Day = require('./day')

class Session extends Model {
}

Session.init({
    startTime: {type: DataTypes.STRING, allowNull: false},
    endTime: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'session', timestamps: false})


Session.belongsTo(Classroom, {foreignKey: {allowNull: false}})
Classroom.hasMany(Session)

Session.belongsTo(SubjectInSemester, {foreignKey: {allowNull: false}})
SubjectInSemester.hasMany(Session)

Session.belongsTo(TeacherInClass, {foreignKey: {allowNull: false}})
TeacherInClass.hasMany(Session)

Session.belongsTo(Day, {foreignKey: {allowNull: false}})
Day.hasMany(Session)


module.exports = Session