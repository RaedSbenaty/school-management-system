const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const Category = require('./category')
const SchoolClass = require('../class/schoolClass')

class SubjectInYear extends Model {
    // static async findByCriteria(siteName, searchClass) {
    //     const school = await School.findOne({
    //         where: { siteName },
    //         include: {
    //             association: 'schoolClasses',
    //             where: searchClass,
    //             include:
    //                 { association: 'subjectInYears',
    //             where:'',
    //         include:{
    //             association: 'category',
    //         } }
    //         }
    //     })
    //     return school.schoolClasses[0]
    // }
}

SubjectInYear.init({
    name: {
        type: DataTypes.STRING, allowNull: false
    },
}, {sequelize, modelName: 'subjectInYear', timestamps: false})

SubjectInYear.belongsTo(Category, {foreignKey: {allowNull: false}})
Category.hasMany(SubjectInYear)

SubjectInYear.belongsTo(SchoolClass, {foreignKey: {allowNull: false}})
SchoolClass.hasMany(SubjectInYear)

module.exports = SubjectInYear