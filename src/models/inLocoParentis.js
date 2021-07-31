//modules
const sequelize = require('../db/sequelize')
const {DataTypes, Model} = require('sequelize')
const Account = require('./account')
const PersonalInfo = require('./personalInfo')
const Student = require('./student/student')


class InLocoParentis extends Model {

}

//InLocoParentis properties
InLocoParentis.init({

}, {sequelize, modelName: 'inLocoParentis', timestamps: false})

//InLocoParentis relations
InLocoParentis.belongsTo(PersonalInfo, {foreignKey: {allowNull: false}})
PersonalInfo.hasOne(InLocoParentis)

InLocoParentis.belongsTo(Account, {foreignKey: {allowNull: false}})
Account.hasOne(InLocoParentis)

InLocoParentis.belongsTo(Student, {foreignKey: {allowNull: false}})
Student.hasMany(InLocoParentis)

module.exports = InLocoParentis