const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const Session = require('./session')
const StudentInClass = require('../student/studentInClass')
const TeacherInClass = require('../teacher/teacherInClass')

class Absence extends Model {
}

Absence.init({
    date: {type: DataTypes.DATE, allowNull: false},
    reason: {type: DataTypes.STRING}
}, {sequelize, modelName: 'absence', timestamps: false})


Absence.belongsTo(Session)
Session.hasMany(Absence)

Absence.belongsTo(StudentInClass)
StudentInClass.hasMany(Absence)

Absence.belongsTo(TeacherInClass)
TeacherInClass.hasMany(Absence)


Absence.beforeSave((absence) => {
    let absents = 0
    if (absence.studentInClassId) absents++
    if (absence.teacherInClassId) absents++

    if (absents !== 1) throw new Error('Just one absent allowed.')
})


module.exports = Absence