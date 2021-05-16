var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var School = require('./school')
var Class = require('./class')

class SchoolClass extends Model {
}

SchoolClass.init({
    startYear: {type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueRecord'},
    endYear: {
        type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueRecord',
        validate: {
            isValidYears(value) {
                if (value < this.startYear)
                    throw new Error('Start year must be before end year.')
            }
        }
    }
}, {sequelize, modelName: 'schoolClass', timestamps: false})


SchoolClass.belongsTo(Class, {foreignKey: {allowNull: false, unique: 'uniqueRecord'}})
Class.hasMany(SchoolClass)

SchoolClass.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(SchoolClass)


module.exports = SchoolClass