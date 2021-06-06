const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const SubjectInYear = require('./subjectInYear')

class SubjectInSemester extends Model {
    // static async findByCriteria(siteName, searchClass) {
    //     const subjectInSemester = await SubjectInSemester.findOne({
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
}, {sequelize, modelName: 'subjectInSemester', timestamps: false})


SubjectInSemester.belongsTo(SubjectInYear, {foreignKey: {allowNull: false}})
SubjectInYear.hasMany(SubjectInSemester)

module.exports = SubjectInSemester