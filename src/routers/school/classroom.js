const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const SchoolClass = require('../../models/class/schoolClass')
const Classroom = require('../../models/class/classroom')
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


//adding subjects from possible categories to a school class through specific semesters
/*
example
{
    "subjects": [
        {
            "categoryId": 1,
            "name": "ck",
            "subjectInSemesters": [
                {"semester": 1},
                {"semester": 3}
            ]
        }
    ]
}
*/
router.post('/:schoolName/:startYear-:endYear/subjects/:className/add', auth, async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')

        const schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        if (!schoolClass)
            return res.status(404).send('This school does not have a ' + className + ' class')

        for (let subject of req.body.subjects)
            await schoolClass.createSubjectInYear(subject, {include: [SubjectInSemester]})

        res.status(201).send('Subjects were added for this class.')
    } catch (e) {
        console.log(e)
        res.status(400).send('Unable to add all subjects.')
    }
})


module.exports = router