const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const SchoolClass = require('../../models/class/schoolClass')
const Classroom = require('../../models/class/classroom')
const StudentInSchool = require('../../models/student/studentInSchool')

const SubjectInSemester = require('../../models/subject/subjectInSemester')


/* post Classrooms
/alhbd/2020-2021/classes/Second_Grade/classrooms/add
{
"classrooms":[
        {
        "classroomNumber":1,
        "studentsNumber":50
        },{
        "classroomNumber":2,
        "studentsNumber":100
        }
]
}
 */
router.post('/:siteName/:startYear-:endYear/classes/:className/classrooms/add',
    auth, async (req, res) => {
        try {
            const className = req.params.className.replace('_', ' ')
            const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
                req.params.endYear, req.params.className)

            if (!schoolClass.id)
                return res.status(400).send(`${req.params.className} class was not found.`)

            await schoolClass.createClassrooms(req.body.classrooms)
            res.send(`Classrooms were added for ${className}.`)
        } catch (e) {
            console.log(e)
            res.status(400).send({error: e.message.split(',')})
        }
    })


/* get Classrooms
/alhbd/2020-2021/classes/Second_Grade
 */
router.get('/:siteName/:startYear-:endYear/classes/:className/classrooms'
    , auth, async (req, res) => {
        try {
            const className = req.params.className.replace('_', ' ')

            const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
                req.params.endYear, className)

            res.send({classrooms: schoolClass.classrooms})
        } catch (e) {
            console.log(e)
            res.status(404).send('Classrooms not found.')
        }
    })

/* patch Classroom
/alhbd/2020-2021/classes/Second_Grade/classrooms/2
{
    "classroom":{
    "studentsNumber": 400
    }
}
 */
router.patch('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber'
    , auth, async (req, res) => {
        try {
            const className = req.params.className.replace('_', ' ')

            const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
                req.params.endYear, className, req.params.classroomNumber)

            await classroom.update(req.body.classroom)
            res.send(`Classroom with number ${req.params.classroomNumber} was edited.`)
        } catch (e) {
            console.log(e)
            res.status(400).send('Updating failed.')
        }
    })

/* delete Classroom
/alhbd/2020-2021/classes/Second_Grade/classrooms/2
 */
router.delete('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber'
    , auth, async (req, res) => {
        try {
            const className = req.params.className.replace('_', ' ')

            const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
                req.params.endYear, className, req.params.classroomNumber)

            await classroom.destroy()
            res.send(`Classroom with number ${req.params.classroomNumber} was deleted.`)
        } catch (e) {
            console.log(e)
            res.status(400).send('Deletion failed.')
        }
    })

// get Students In a classroom (in a year)
// /alhbd/2020-2021/classes/Second_Grade/classrooms/1/students
router.get('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber/students', auth
    , async (req, res) => StudentInSchool.handleGetStudentsRequest(req, res))


module.exports = router