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
            res.status(400).send({ error: e.message.split(',') })
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

            res.send({ classrooms: schoolClass.classrooms })
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

// distribute students through classrooms according to their registiration date in db
/*
example
/alhbd/2020-2021/classes/Second_Grade/classrooms_students

[
    {
        "studentsNumber": 1,
        "classroomNumber": 1
    },
    {
        "studentsNumber": 1,
        "classroomNumber": 2
    }
]
*/
router.patch('/:siteName/:startYear-:endYear/classes/:className/classrooms_students', auth, async (req, res) => {

    const className = req.params.className.replace('_', ' ')
    try {
        const studentsInSchool = await StudentInSchool.getStudents(req.account.school.id, req.params.startYear, req.params.endYear, className)

        var i = 0;
        element = req.body[i]

        for (let student of studentsInSchool) {
        var studentInClass = await student.getStudentInClasses()
            if (element.studentsNumber === 0) {
                i++
                element = req.body[i]
            }
            var classroomId = element.classroomNumber

            await studentInClass[0].update({"classroomId": classroomId})

            element.studentsNumber--
        }
        res.status(201).send("students classrooms for " + className + " class have been updated according to their registiration date.")

    }
    catch (e) {
        console.log(e)
        res.status(400).send('Updating failed.')
    }
})

// get Students In a classroom (in a year)
// /alhbd/2020-2021/classes/Second_Grade/classrooms/1/students
router.get('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber/students', auth
    , async (req, res) => StudentInSchool.handleGetStudentsRequest(req, res))


module.exports = router