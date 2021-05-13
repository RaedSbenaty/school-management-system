var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var Account = require('./account')
var PersonalInfo = require('./personalInfo')

class Teacher extends Model {
}

Teacher.init({
    certification: {type: DataTypes.STRING, allowNull: false},
    certificationIssuer: {type: DataTypes.STRING},
    certificationDate: {type: DataTypes.DATE},
}, {sequelize, modelName: 'teacher', timestamps: false})


Teacher.belongsTo(Account, {foreignKey: {allowNull: false}})
Account.hasOne(Teacher)

Teacher.belongsTo(PersonalInfo, {foreignKey: {allowNull: false}})
PersonalInfo.hasOne(Teacher)


module.exports = Teacher
