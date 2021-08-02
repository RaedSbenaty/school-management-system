const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')

const StudentInClass = require('./studentInClass')

class Payment extends Model {
}

Payment.init({
    value: {type: DataTypes.INTEGER, allowNull: false},
    date: {type: DataTypes.DATE, allowNull: false}
}, {sequelize, modelName: 'payment', timestamps: false})

Payment.belongsTo(StudentInClass, {foreignKey: {allowNull: false}})
StudentInClass.hasMany(Payment)

module.exports = Payment