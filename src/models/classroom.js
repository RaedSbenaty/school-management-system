var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var School = require('./school')
var SchoolClass = require('./schoolClass')
var Teacher = require('./teacher')
var Student = require('./student')


class Classroom extends Model {
    static async findByCriteria(siteName, searchClass, classroomNumber) {
        var school = await School.findOne({
            where: {siteName},
            include: {
                association: 'schoolClasses', where: searchClass,
                include: {association: 'classrooms', where: {classroomNumber}}
            }
        })
        return school.schoolClasses[0].classrooms[0]
    }
}

Classroom.init({
    classroomNumber: {type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueClassroom'},
    studentsNumber: {type: DataTypes.INTEGER, allowNull: false}
}, {sequelize, modelName: 'classroom', timestamps: false})


Classroom.belongsTo(SchoolClass, {foreignKey: {allowNull: false, unique: 'uniqueClassroom'}})
SchoolClass.hasMany(Classroom)

Classroom.hasMany(Student)
Student.belongsTo(Classroom, {foreignKey: {allowNull: false}})

module.exports = Classroom