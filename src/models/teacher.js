var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var Personal_Info = require('./personal-info')
var Account = require('./account')

class Teacher extends Model {
}

Teacher.init({
    certification: {type: DataTypes.STRING, allowNull: false},
    certificationIssuer: {type: DataTypes.STRING},
    certificationDate: {type: DataTypes.DATE},
}, {sequelize})



Account.hasOne(Teacher)
Teacher.belongsTo(Account, {foreignKey: {allowNull: false}})

Personal_Info.hasOne(Teacher)
Teacher.belongsTo(Personal_Info, {foreignKey: {allowNull: false}})


module.exports = Teacher
