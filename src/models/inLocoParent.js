//modules
const sequelize = require('../db/sequelize')
const {DataTypes, Model} = require('sequelize')
const Account = require('./account')
const Student = require('./student/student')


class InLocoParent extends Model {

}

//InLocoParent properties
InLocoParent.init({

}, {sequelize, modelName: 'inLocoParent', timestamps: false})

//InLocoParent relations
InLocoParent.belongsTo(Account, {foreignKey: {allowNull: false}})
Account.hasOne(InLocoParent)

InLocoParent.belongsTo(Student, {foreignKey: {allowNull: false}, unique: 'unique student\'s inLocoParent'})
Student.hasOne(InLocoParent)

module.exports = InLocoParent