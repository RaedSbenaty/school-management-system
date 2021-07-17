const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')
const TeacherInSchool = require('./teacherInSchool')

class TeacherInYear extends Model {
}

TeacherInYear.init({
    startYear: { type: DataTypes.INTEGER, allowNull: false },
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