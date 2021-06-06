const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Mark = require('../../models/subject/mark')
const SubjectInSemester = require('../../models/subject/subjectInSemester')


// get Students marks In a class (in a year)
// /alhbd/2020-2021/classes/Second_Grade/marks/1
router.get('/:siteName/:startYear-:endYear/classes/:className/marks/:sisId', auth
    , async (req, res) => Mark.handleGetMarksRequest(req, res))

// get Students marks In a classroom (in a year)
// /alhbd/2020-2021/classes/Second_Grade/classrooms/1/marks/1
router.get('/:siteName/:startYear-:endYear/classes/:className/classrooms/' +
    ':classroomNumber/marks/:sisId', auth
    , async (req, res) => Mark.handleGetMarksRequest(req, res))


router.post('/testMarks', auth, async (req, res) => {
    await SubjectInSemester.create({semester: 1, subjectInYearId: 1})
    await Mark.bulkCreate(
        [{value: 50, fullMarks: 50, examTypeId: 1, subjectInSemesterId: 1, studentInClassId: 1}
            , {value: 50, fullMarks: 50, examTypeId: 2, subjectInSemesterId: 1, studentInClassId: 1}
            , {value: 50, fullMarks: 50, examTypeId: 3, subjectInSemesterId: 1, studentInClassId: 1}])
    res.send()
})


module.exports = router