//modules
const sequelize = require('../db/sequelize')
const { DataTypes, Model } = require('sequelize')
const Account = require('./account')
const Personal_Info = require('./personal-info')
const AcademicIrregularity = require('./academicIrregularity')

class Student extends Model { }

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
        allowNull: false
    },
    lastDegree: {
        type: DataTypes.STRING,
    },
}, { sequelize })

//Student relations
Account.hasOne(Student)
Student.belongsTo(Account, { foreignKey: { allowNull: false } })

Personal_Info.hasOne(Student)
Student.belongsTo(Personal_Info, { foreignKey: { allowNull: false } })

// Student.hasMany(AcademicIrregularity)
// AcademicIrregularity.belongsTo(Student)

module.exports = Student