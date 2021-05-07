var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')

class Personal_Info extends Model {}

Personal_Info.init({
    firstName: {type: DataTypes.STRING, allowNull: false},
    lastName: {type: DataTypes.STRING, allowNull: false},
    birthDate: {type: DataTypes.DATE, allowNull: false},
    residentialAddress: {type: DataTypes.STRING, allowNull: false},
    personalImage: {type: DataTypes.STRING.BINARY}
},{sequelize})


module.exports = Personal_Info
