const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Mark = require('../../models/subject/mark')


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
     await Mark.create({value: 700, studentInClassId: 4, examId: 8})
    res.send()
})


module.exports = router