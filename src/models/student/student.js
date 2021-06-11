//modules
const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')
const Account = require('../account')
const PersonalInfo = require('../personalInfo')
const Class = require('../class/class')
const SchoolClass = require('../class/schoolClass')


class Student extends Model {

    async assignClassId(schoolClassId) {
        const schoolClass = await SchoolClass.findByPk(schoolClassId)
        if (!schoolClass) throw new Error('SchoolClass not found.')
        await this.update({classId: schoolClass.classId})
    }
}

//Student properties
Student.init({
    fatherName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    motherName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastSchoolAttended: {
        type: DataTypes.STRING,
    }
}, {sequelize, modelName: 'student', timestamps: false})

//Student relations
Student.belongsTo(PersonalInfo, {foreignKey: {allowNull: false}})
PersonalInfo.hasOne(Student)

Student.belongsTo(Account, {foreignKey: {allowNull: false}})
Account.hasOne(Student)

Student.belongsTo(Class)
Class.hasMany(Student)

// Student.hasMany(AcademicIrregularity)
// AcademicIrregularity.belongsTo(Student)

module.exports = Student