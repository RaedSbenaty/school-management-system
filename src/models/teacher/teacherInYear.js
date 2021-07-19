const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')
const TeacherInSchool = require('./teacherInSchool')

class TeacherInYear extends Model {
    static async getTeacherInYear(teacherId, schoolId, startYear, endYear) {
        return await TeacherInYear.findOne({
            where: {startYear, endYear},
            include: [{association: 'teacherInSchool', attributes: [], where: {teacherId, schoolId}},
                {association: 'teacherInClasses', attributes: ['id', 'schoolClassId', 'classroomId']}]
        })
    }
}

TeacherInYear.init({
    startYear: {type: DataTypes.INTEGER, allowNull: false},
    endYear: {
        type: DataTypes.INTEGER, allowNull: false,
        validate: {
            isValidPeriod(year) {
                if (year < this.startYear)
                    throw new Error('Start year must be before end year.')
            }
        }
    }
}, {sequelize, modelName: 'teacherInYear', timestamps: false})

TeacherInYear.belongsTo(TeacherInSchool, {foreignKey: {allowNull: false}})
TeacherInSchool.hasMany(TeacherInYear)

module.exports = TeacherInYear