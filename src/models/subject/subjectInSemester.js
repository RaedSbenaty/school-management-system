const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const SubjectInYear = require('./subjectInYear')

class SubjectInSemester extends Model {

    static async getSemesterSubjects(schoolId, startYear, endYear, className, semester, categoryName, name) {
        const where = {
            semester,
            '$subjectInYear.schoolClass.startYear$': startYear,
            '$subjectInYear.schoolClass.endYear$': endYear,
        }

        if (categoryName) where['$subjectInYear.category.name$'] = categoryName
        if (name) where['$subjectInYear.name$'] = name
        if (className) where['$subjectInYear.schoolClass.class.name$'] = className
        if (schoolId) where['$subjectInYear.schoolClass.schoolId$'] = schoolId

        return await SubjectInSemester.findAll({
            where,
            include: {
                association: 'subjectInYear',
                include: [{association: 'schoolClass', include: 'class'}, 'category']
            },
        })
    }

    static async handleGetSubjectsRequests(req, res) {
        try {
            let className
            if (req.params.className) className = req.params.className.replace('_', ' ')
            const subjects = await SubjectInSemester.getSemesterSubjects(req.account.school.id, req.params.startYear,
                req.params.endYear, className, req.params.semester, req.params.categoryName, req.params.name)
            res.send({subjects})
        } catch (e) {
            console.log(e)
            res.status(400).send(e)
        }
    }


    static async getStudentMarksInSemester(studentInClassId, schoolClassId) {
        const subjectInSemesters = await SubjectInSemester.findAll({
            attributes: ['semester'], include: [
                {association: 'subjectInYear', attributes: ['name'], where: {schoolClassId}},
                {
                    association: 'exams', attributes: ['fullMark', 'dateOfExam'],
                    include: [{association: 'examType', attributes: ['name']},
                        {association: 'marks', attributes: ['value'], where: {studentInClassId}, required: false}
                    ]
                }]
        })
        const semesters = {}
        subjectInSemesters.forEach(subject => {
            const semester = subject.semester
            delete subject.dataValues.semester
            semesters[semester] = semesters[semester] || []
            semesters[semester].push(subject)
        })
        return semesters
    }
}

SubjectInSemester.init({
    semester: {type: DataTypes.INTEGER, allowNull: false}
}, {sequelize, modelName: 'subjectInSemester', timestamps: false})


SubjectInSemester.belongsTo(SubjectInYear, {foreignKey: {allowNull: false}})
SubjectInYear.hasMany(SubjectInSemester)

module.exports = SubjectInSemester