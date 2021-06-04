var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var Category = require('./category')
var SchoolClass = require('./schoolClass')

class SubjectInYear extends Model {
    // static async findByCriteria(siteName, searchClass) {
    //     var school = await School.findOne({
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