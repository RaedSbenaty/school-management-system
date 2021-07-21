//modules
const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const Day = require('../day')
const School = require('../school/school')

class GeneralInfo extends Model {

}

//generalInfo properties
GeneralInfo.init({
    startTime: {
        type: DataTypes.STRING,
        allowNull: false
    },
    breakFrequency: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    breakDuration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sessionDuration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startYear: {type: DataTypes.INTEGER, allowNull: false,unique: 'uniqueYearInfo'},
    endYear: {
        type: DataTypes.INTEGER, allowNull: false,unique: 'uniqueYearInfo',
        validate: {
            isValidPeriod(year) {
                if (year < this.startYear)
                    throw new Error('Start year must be before end year.')
            }
        }
    }
}, {sequelize, modelName: 'generalInfo', timestamps: false})

//generalInfo relations
GeneralInfo.belongsTo(School, {foreignKey: {allowNull: false,unique: 'uniqueYearInfo'}})
School.hasMany(GeneralInfo)

module.exports = GeneralInfo