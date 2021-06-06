const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const SchoolClass = require('./schoolClass')
const Student = require('../student/student')


class Classroom extends Model {
    static async findByCriteria(schoolId, startYear, endYear, className, classroomNumber) {
        return await Classroom.findOne({
            where: {classroomNumber},
            include: {
                association: 'schoolClass', where: {schoolId, startYear, endYear},
                include: {association: 'class', where: {name: className}}
            }
        })
    }
}

Classroom.init({
    classroomNumber: {type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueClassroom'},
    studentsNumber: {type: DataTypes.INTEGER, allowNull: false}
}, {sequelize, modelName: 'classroom', timestamps: false})


Classroom.belongsTo(SchoolClass, {foreignKey: {allowNull: false, unique: 'uniqueClassroom'}})
SchoolClass.hasMany(Classroom)


module.exports = Classroom