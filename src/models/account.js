var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')

class Account extends Model {

}

Account.init({}, {sequelize})

module.exports = Account
