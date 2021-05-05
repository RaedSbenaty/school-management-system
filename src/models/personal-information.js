var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')

class Personal_Information extends Model {

}

Personal_Information.init({}, {sequelize})

module.exports = Personal_Information
