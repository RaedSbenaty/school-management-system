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
        type: DataTypes.STRING,
        allowNull: false
    },
    breakDuration: {
        type: DataTypes.TIME,
        allowNull: false
    },
    sessionDuration: {
        type: DataTypes.TIME,
        allowNull: false
    },
}, {sequelize, modelName: 'generalInfo', timestamps: false})

//generalInfo relations
GeneralInfo.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasOne(GeneralInfo)

module.exports = GeneralInfo