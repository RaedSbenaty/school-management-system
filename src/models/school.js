//modules
const { DataTypes, Model } = require('sequelize')
const sequelize = require('../db/sequelize')
const Account = require('./account')

class School extends Model { }

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
}, { sequelize,timestamps:false })

//School relations
Account.hasOne(School)
School.belongsTo(Account, { foreignKey: { allowNull: false } })

//School.hasMany(Content)

module.exports = School