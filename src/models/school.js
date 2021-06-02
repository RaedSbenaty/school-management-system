//modules
const {DataTypes, Model} = require('sequelize')
const sequelize = require('../db/sequelize')
var Account = require('./account')

class School extends Model {

    static async findByCriteriaInPeriod(schoolId, startYear, endYear) {
        return await School.findOne({
            where: {id: schoolId},
            include: {association: 'schoolClasses', where: {startYear, endYear}, include: 'class'}
        }) || {schoolClasses: []}
    }
}

//School properties
School.init({
    schoolName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foundationDate: {
        type: DataTypes.DATE,
    },
    facebookPage: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true,
            is: /^(http|https):\/\/www.facebook.com\/.*/i
        }
    },
}, {sequelize, modelName: 'school', timestamps: false})

//School relations
School.belongsTo(Account, {foreignKey: {allowNull: false}})
Account.hasOne(School)

//School.hasMany(Content)

module.exports = School