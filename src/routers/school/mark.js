const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const Classroom = require('../../models/class/classroom')
const SchoolClass = require('../../models/class/schoolClass')
const Exam = require('../../models/subject/exam')
const Mark = require('../../models/subject/mark')

//adding marks of an exam for a subject in semester for students in a classroom 
/*
example
/alhbd/2020-2021/classes/Second_Grade/classrooms/1/examMarks/add

{
    "fullMark": 100,
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

router.post('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber/examMarks/add', auth, async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')

        const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        if (!schoolClass.id)
            return res.status(404).send('This school does not have a ' + className + ' class')

        const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className, req.params.classroomNumber)

        if (!classroom.id)
            return res.status(404).send('This school does not have a ' + classroomNumber + ' classroom')

        await Exam.create(req.body, { include: [Mark] })

        res.status(201).send('Marks have been successfuly added.')

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message.split(','))
    }
})

// get Students marks In a class (in a year)
// /alhbd/2020-2021/classes/Second_Grade/subjects/1/marks/1/types/1
router.get('/:siteName/:startYear-:endYear/classes/:className/subjects/:sisId' +
    '/marks/types/:typeId', auth
    , async (req, res) => Mark.handleGetMarksRequest(req, res))

// get Students marks In a classroom (in a year)
// /alhbd/2020-2021/classes/Second_Grade/classrooms/1/marks/1
router.get('/:siteName/:startYear-:endYear/classes/:className/classrooms/' +
    ':classroomNumber/subjects/:sisId/marks/types/:typeId', auth
    , async (req, res) => Mark.handleGetMarksRequest(req, res))


//danger! get out from here!!
router.post('/testMarks', auth, async (req, res) => {
    // await Exam.bulkCreate(
    //     [{fullMarks: 100, examTypeId: 1, subjectInSemesterId: 1},
    //         {fullMarks: 90, examTypeId: 2, subjectInSemesterId: 1},
    //         {fullMarks: 80, examTypeId: 1, subjectInSemesterId: 2}
    //         , {fullMarks: 100, examTypeId: 1, subjectInSemesterId: 3},
    //         {fullMarks: 90, examTypeId: 2, subjectInSemesterId: 4},
    //         {fullMarks: 80, examTypeId: 1, subjectInSemesterId: 4},
    //     ])
    // await Mark.bulkCreate(
    //     [{value: 70, studentInClassId: 1, examId: 1}, {value: 20, studentInClassId: 2, examId: 1},
    //         {value: 10, studentInClassId: 1, examId: 2}, {value: 70, studentInClassId: 2, examId: 3},
    //         {value: 70, studentInClassId: 3, examId: 2},
    //         {value: 70, studentInClassId: 4, examId: 4}, {value: 5, studentInClassId: 5, examId: 4},
    //         {value: 70, studentInClassId: 6, examId: 5}, {value: 70, studentInClassId: 7, examId: 6},
    //     ])
    // await Exam.create({fullMarks: 80, examTypeId: 1, subjectInSemesterId: 1})
    //    await Mark.create({value: 700, studentInClassId: 4, examId: 8})
    res.send()
})


module.exports = router