const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const Account = require('../account')
const PersonalInfo = require('../personalInfo')

class Teacher extends Model {

    // Added new 
    // async assignClassId(schoolClassId) {
    //     const schoolClass = await SchoolClass.findByPk(schoolClassId)
    //     if (!schoolClass) throw new Error('SchoolClass not found.')
    //     await this.update({classId: sequelize.fn('array_append', sequelize.col('classId'), schoolClass.classId)})
    // }

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
