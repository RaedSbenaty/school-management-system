const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const School = require('./school')

class Content extends Model {
}

Content.init({
    type: {type: DataTypes.ENUM('Primary', 'Secondary'), allowNull: false},
    header: {type: DataTypes.STRING, allowNull: false},
    body: {type: DataTypes.TEXT},

}, {sequelize, modelName: 'content', timestamps: false})

Content.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(Content)

module.exports = Content