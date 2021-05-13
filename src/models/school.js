//modules
const {DataTypes, Model} = require('sequelize')
const sequelize = require('../db/sequelize')
var Account = require('./account')
class School extends Model {
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
    siteName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {is: /^[a-zA-Z0-9_-]+$/}
    }
}, {sequelize,modelName:'school', timestamps: false})

//School relations
School.belongsTo(Account, {foreignKey: {allowNull: false}})
Account.hasOne(School)

//School.hasMany(Content)

module.exports = School