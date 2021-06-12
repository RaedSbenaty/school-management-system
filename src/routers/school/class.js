const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const School = require('../../models/school')
const Classroom = require('../../models/class/classroom')
const StudentInSchool = require('../../models/student/studentInSchool')
const StudentInClass = require('../../models/student/studentInClass')


/* post Classes
/alhbd/2020-2021/classes/add
{"classes":[1,3,5]}
 */
router.post('/:siteName/:startYear-:endYear/classes/add', auth(['School']), async (req, res) => {
    try {
        const school = req.account.school
        school.schoolClasses = await school.getSchoolClasses()

        await school.createSchoolClasses(req.params.startYear, req.params.endYear, req.body.classes)
        res.send(`Classes with id: ${req.body.classes} were added.`)
    } catch (e) {
        console.log(e)
        res.status(400).send({error: e.message.split(',')})
    }
})


/* get Classes
/alhbd/2020-2021/classes
 */
router.get('/:siteName/:startYear-:endYear/classes', auth(['School']), async (req, res) => {
    try {
        const school = await School.findByCriteriaInPeriod(req.account.school.id
            , req.params.startYear, req.params.endYear)

        res.send({schoolClasses: school.schoolClasses})
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
})

// get Students In a class (in a year)
// /alhbd/2020-2021/classes/Second_Grade/students
router.get('/:siteName/:startYear-:endYear/classes/:className/students', auth(['School'])
    , async (req, res) => StudentInSchool.handleGetStudentsRequest(req, res))

// post Sort Students to classroom
// /alhbd/2020-2021/classes/Preschool/sortStd
//  [{"id":1,"classroomNumber":180},
//  {"id":2,"classroomNumber":250}]

router.post('/:siteName/:startYear-:endYear/classes/:className/sortStd', auth(['School'])
    , async (req, res) => {
        try {
            for (const student of req.body) {
                const {id, classroomNumber} = student
                const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
                    req.params.endYear, req.params.className, classroomNumber)
                if (classroom)
                    await StudentInClass.update({classroomId: classroom.id}, {where: {id}})
            }
            res.send('Sorting is done.')
        } catch (e) {
            console.log(e)
            res.status(500).send('Sorting students failed.')
        }
    })


module.exports = router
