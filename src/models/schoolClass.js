var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var School = require('./school')
var Class = require('./class')

class SchoolClass extends Model {
}

SchoolClass.init({
    year: {type: DataTypes.INTEGER, allowNull: false}
}, {sequelize, modelName: 'schoolClass', timestamps: false})


SchoolClass.belongsTo(Class, {foreignKey: {allowNull: false}})
Class.hasMany(SchoolClass)

SchoolClass.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(SchoolClass)


module.exports = SchoolClass