const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../db/sequelize')
const Category = require('./category')
const SchoolClass = require('../class/schoolClass')

class SubjectInYear extends Model {
}
SubjectInYear.init({
    name: {
        type: DataTypes.STRING, allowNull: false, unique: "uniqueSubjectInClass"
    },
}, { sequelize, modelName: 'subjectInYear', timestamps: false })

SubjectInYear.belongsTo(Category, { foreignKey: { allowNull: false } })
Category.hasMany(SubjectInYear)

SubjectInYear.belongsTo(SchoolClass, { foreignKey: { allowNull: false, unique: "uniqueSubjectInClass" } })
SchoolClass.hasMany(SubjectInYear)

module.exports = SubjectInYear