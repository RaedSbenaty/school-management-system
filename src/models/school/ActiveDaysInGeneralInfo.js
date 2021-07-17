//modules
const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const Day = require('../day')
const GeneralInfo = require('./generalInfo')

class ActiveDaysInGeneralInfo extends Model {

}

//activeDaysInGeneralInfo properties
ActiveDaysInGeneralInfo.init({
   
}, {sequelize, modelName: 'activeDaysInGeneralInfo', timestamps: false})

//activeDaysInGeneralInfo relations
ActiveDaysInGeneralInfo.belongsTo(GeneralInfo, {foreignKey: {allowNull: false}})
GeneralInfo.hasMany(ActiveDaysInGeneralInfo)

ActiveDaysInGeneralInfo.belongsTo(Day, {foreignKey: {allowNull: false}})
Day.hasMany(ActiveDaysInGeneralInfo)

module.exports = ActiveDaysInGeneralInfo