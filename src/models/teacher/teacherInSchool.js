const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')
const School = require('../school')
const Teacher = require('./teacher')

class TeacherInSchool extends Model {

    static async getTeachers(schoolId, startYear, endYear) {
        const where = {
            schoolId,
            '$schoolClass.startYear$': startYear,
            '$schoolClass.endYear$': endYear
        }

        return await StudentInSchool.findAll({
            where,
            include: [ {association: 'teacher', include: ['personalInfo', 'account']} ]
            , order: ['ASC']
        })
    }
}

TeacherInSchool.init({}
    , {sequelize, modelName: 'teacherInSchool', timestamps: false})

TeacherInSchool.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(TeacherInSchool)

TeacherInSchool.belongsTo(Teacher, {foreignKey: {allowNull: false}})
Teacher.hasMany(TeacherInSchool)

module.exports = TeacherInSchool