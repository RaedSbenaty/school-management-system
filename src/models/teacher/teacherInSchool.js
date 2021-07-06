const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')
const School = require('../school')
const Teacher = require('./teacher')

class TeacherInSchool extends Model {

    static async getTeachers(schoolId, startYear, endYear, className) {
        const where = {
            schoolId,
            '$teacherInClasses.schoolClass.startYear$': startYear,
            '$teacherInClasses.schoolClass.endYear$': endYear
        }

        if (className) where['$teacherInClasses.schoolClass.class.name$'] = className

        return await TeacherInSchool.findAll({
            where,
            include: [{association: 'teacher', include: ['personalInfo', 'account']},
                {
                    association: 'teacherInClasses', attributes: ['id', 'createdAt'],
                }]
            , order: [['createdAt', 'ASC']]
        })
    }

    // static async getTeachers(schoolId, startYear, endYear) {
    //     const where = {schoolId, startYear, endYear}

    //     return await TeacherInSchool.findAll({
    //         where,
    //         include: [ {association: 'teacher', include: ['personalInfo', 'account']} ]
    //     })
    // }


    static async handleGetTeachersRequest(req, res) {
        try {
            let className
            if (req.params.className) className = req.params.className.replace('_', ' ')
            const teachers = await TeacherInSchool.getTeachers(req.account.school.id, req.params.startYear,
                req.params.endYear, className)
            res.send({teachers})
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }

    // static async handleGetTeachersRequest(req, res) {
    //     try {
    //         // let className
    //         // if (req.params.className) className = req.params.className.replace('_', ' ')
    //         const teachers = await TeacherInSchool.getTeachers(req.account.school.id, req.params.startYear, req.params.endYear)
    //         res.send({teachers})
    //     } catch (e) {
    //         console.log(e)
    //         res.status(400).send(e)
    //     }
    // }
    
}

TeacherInSchool.init({}, {sequelize, modelName: 'teacherInSchool', timestamps: false})

TeacherInSchool.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(TeacherInSchool)

TeacherInSchool.belongsTo(Teacher, {foreignKey: {allowNull: false}})
Teacher.hasMany(TeacherInSchool)

module.exports = TeacherInSchool