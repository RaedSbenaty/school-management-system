const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const Classroom = require('../../models/class/classroom')
const SchoolClass = require('../../models/class/schoolClass')
const StudentInClass = require('../../models/student/studentInClass')
const SubjectInSemester = require('../../models/subject/subjectInSemester')
const Exam = require('../../models/subject/exam')
const Mark = require('../../models/subject/mark')

//adding marks of an exam for a subject in semester for students in a classroom 
/*
example
/alhbd/2020-2021/classes/Second_Grade/classrooms/1/examMarks/add

{
    "fullMark": 100,
    "dateOfExam": "01-01-2021",
    "examTypeId": 1,
    "subjectInSemesterId": 1,
    "marks": [
        {
            "studentInClassId": 1,
            "value": 100
        },
        {
            "studentInClassId": 2,
            "value": 90
        }
    ]
}
*/

router.post('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber/examMarks/add', auth(['School']), async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')

        const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        if (!schoolClass)
            return res.status(404).send('This school does not have a ' + className + ' class')

        const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className, req.params.classroomNumber)

        if (!classroom)
            return res.status(404).send('This school does not have a ' + classroomNumber + ' classroom')

        await Exam.create(req.body, {include: [Mark]})
        res.status(201).send('Marks have been successfully added.')

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message.split(','))
    }
})

// get Students marks In a class (in a year)
// /alhbd/2020-2021/classes/Second_Grade/subjects/1/marks/1/types/1
router.get('/:siteName/:startYear-:endYear/classes/:className/subjects/:sisId' +
    '/marks/types/:typeId', auth(['School'])
    , async (req, res) => Mark.handleGetMarksRequest(req, res))


// get Students marks In a classroom (in a year)
// /alhbd/2020-2021/classes/Second_Grade/classrooms/1/marks/1
router.get('/:siteName/:startYear-:endYear/classes/:className/classrooms/' +
    ':classroomNumber/subjects/:sisId/marks/types/:typeId', auth(['School'])
    , async (req, res) => Mark.handleGetMarksRequest(req, res))


// get student marks (in every semester in a year)
// /alhbd/2020-2021/students/1/marks
router.get('/:siteName/:startYear-:endYear/students/:studentId/marks', auth(['School']), async (req, res) => {
    try {
        const studentInClass = await StudentInClass.getStudentInClass(req.params.studentId
            , req.account.school.id, req.params.startYear, req.params.endYear)
        const studentMarks = await SubjectInSemester.getStudentMarksInSemester(studentInClass.id)
        res.send(studentMarks)
    }catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

module.exports = router