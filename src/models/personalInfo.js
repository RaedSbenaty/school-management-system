var { DataTypes, Model } = require('sequelize')
var sequelize = require('../db/sequelize')

class PersonalInfo extends Model { }

PersonalInfo.init({
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    birthDate: { type: DataTypes.DATE, allowNull: false },
    residentialAddress: { type: DataTypes.STRING, allowNull: false },
}, { sequelize,modelName:'personalInfo',timestamps:false })


module.exports = PersonalInfo
