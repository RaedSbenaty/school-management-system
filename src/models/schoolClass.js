var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var School = require('./school')
var Class = require('./class')

class SchoolClass extends Model {
    static async findByCriteria(siteName, searchClass) {
        var school = await School.findOne({
            where: {siteName},
            include: {association: 'schoolClasses', where: searchClass, include: 'classrooms'}
        })
        return school.schoolClasses[0]
    }
}

SchoolClass.init({
    startYear: {type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueSchoolClass'},
    endYear: {
        type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueSchoolClass',
        validate: {
            isValidYears(value) {
                if (value < this.startYear)
                    throw new Error('Start year must be before end year.')
            }
        }
    }
}, {sequelize, modelName: 'schoolClass', timestamps: false})


SchoolClass.belongsTo(Class, {foreignKey: {allowNull: false, unique: 'uniqueSchoolClass'}})
Class.hasMany(SchoolClass)

SchoolClass.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(SchoolClass)


module.exports = SchoolClass