const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')
const School = require('../school/school')
const Teacher = require('./teacher')


class TeacherInSchool extends Model {

    // added new
    // static async ActivateAccount(teacherId, schoolId) {
    //     const where = {teacherId, schoolId}
    //     let teacherInSchool = await TeacherInSchool.findOne({where, include: 'teacherInClasses'})
    //     if (teacherInSchool) await teacherInSchool.update({active: true})
    //     else teacherInSchool = await teacherInSchool.create(where)
    //     return teacherInSchool
    // }
    
    static async getTeachers(schoolId, startYear, endYear) {
        
        return await TeacherInSchool.findAll({
            subQuery: false,
            where: {schoolId},
            include:{
                association: 'teacherInYears', where:{startYear,endYear}, required: true
            }
        })
    }

    static async handleGetTeachersRequest(req, res) {
        try {
            // let className
            // if (req.params.className) className = req.params.className.replace('_', ' ')
            const teachers = await TeacherInSchool.getTeachers(req.account.school.id, req.params.startYear, req.params.endYear)
            res.send({teachers})
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
}

TeacherInSchool.init({
    active: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true}
}, {sequelize, modelName: 'teacherInSchool', timestamps: false})

TeacherInSchool.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(TeacherInSchool)

TeacherInSchool.belongsTo(Teacher, {foreignKey: {allowNull: false}})
Teacher.hasMany(TeacherInSchool)

module.exports = TeacherInSchool