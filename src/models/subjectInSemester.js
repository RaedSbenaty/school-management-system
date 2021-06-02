var { DataTypes, Model } = require('sequelize')
var sequelize = require('../db/sequelize')
var SubjectInYear = require('./SubjectInYear')

class SubjectInSemester extends Model {
    // static async findByCriteria(siteName, searchClass) {
    //     var subjectInSemester = await SubjectInSemester.findOne({
    //         where: { siteName },
    //         include: { association: 'schoolClasses', where: searchClass, include: 'classrooms' }
    //     })
    //     return school.schoolClasses[0]
    // }
}

SubjectInSemester.init({
    semester: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { sequelize, modelName: 'subjectInSemester', timestamps: false })


SubjectInYear.belongsTo(SubjectInSemester, { foreignKey: { allowNull: false } })
SubjectInSemester.hasMany(SubjectInYear)

module.exports = SubjectInSemester