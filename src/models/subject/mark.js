const {DataTypes, Model, Sequelize} = require('sequelize')
const sequelize = require('../../db/sequelize')

const StudentInClass = require('../student/studentInClass')
const Exam = require('./exam')

class Mark extends Model {
    static async getStudentsMarks(schoolId, startYear, endYear, className, classroomNumber, subjectInSemesterId, examTypeId) {
        const where = {
            '$marks.studentInClass.studentInSchool.schoolId$': schoolId,
            '$marks.studentInClass.schoolClass.startYear$': startYear,
            '$marks.studentInClass.schoolClass.endYear$': endYear,
            '$marks.studentInClass.schoolClass.class.name$': className,
            subjectInSemesterId, examTypeId,
        }
        if (classroomNumber) where['$marks.studentInClass.classroom.classroomNumber$'] = classroomNumber

        const markAssociation = {
            association: 'studentInClass', attributes: [],
            include: [
                {association: 'schoolClass', attributes: [], include: {association: 'class', attributes: []}},
                {association: 'classroom', attributes: []},
                {
                    association: 'studentInSchool', attributes: [],
                    include: [
                        {association: 'school', attributes: []},
                        {
                            association: 'student', attributes: [],
                            include: {association: 'personalInfo', attributes: []}
                        }]
                }]
        }

        const exams = await Exam.findAll({
            where,
            attributes: ['id', 'createdAt', 'fullMarks'],
            include: {association: 'marks', attributes: [], include: markAssociation}
        })

        for (const exam of exams) {
            exam.dataValues.marks = await exam.getMarks({
                include: markAssociation
                , attributes: ['value'
                    , [Sequelize.col('studentInClass.studentInSchool.student.personalInfo.firstName'), 'firstName']
                    , [Sequelize.col('studentInClass.studentInSchool.student.personalInfo.lastName'), 'lastName']
                ]
            })
        }
        return exams
    }

    static async handleGetMarksRequest(req, res) {
        try {
            let className
            if (req.params.className) className = req.params.className.replace('_', ' ')
            const exams = await Mark.getStudentsMarks(req.account.school.id, req.params.startYear,
                req.params.endYear, className, req.params.classroomNumber, req.params.sisId, req.params.typeId)
            res.send({exams})
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }
}

Mark.init({
    value: {type: DataTypes.INTEGER, allowNull: false},
}, {sequelize, modelName: 'mark', timestamps: false})

Mark.belongsTo(StudentInClass, {foreignKey: {allowNull: false, unique: 'uniqueStudentMark'}})
StudentInClass.hasMany(Mark)

Mark.belongsTo(Exam, {foreignKey: {allowNull: false, unique: 'uniqueStudentMark'}})
Exam.hasMany(Mark)

Mark.beforeSave(async (mark) => {
    const exam = await mark.getExam()
    if (mark.value < 0 || mark.value > exam.fullMarks)
        throw new Error('Mark can\'t be higher than full marks.')
})

module.exports = Mark



