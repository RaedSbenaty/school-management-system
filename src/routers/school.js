var express = require('express')
var {Op, where, Association} = require('sequelize')
var router = express.Router()

var School = require('../models/school')
var Account = require('../models/account')
var Class = require('../models/class')
var SchoolClass = require('../models/schoolClass')
var Classroom = require('../models/classroom')

var auth = require('../middlewares/auth')
const SubjectInYear = require('../models/SubjectInYear')
const SubjectInSemester = require('../models/subjectInSemester')
const Category = require('../models/category')


//example
/*
{
        "schoolName": "Raghad",
        "location": "midan",
        "foundationDate": "08-05-2021",
        "facebookPage": "https://www.facebook.com/AlHudoodNet/",
        "account": {
        "siteName": "alhbd",
        "email": "dodeh@hbd.com",
        "password": "100009078",
        "phoneNumber": "+963944656499"
         }
}
*/

//sign up
router.post('/schools/signup', async (req, res) => {
    try {
        req.body.account.user = 'School'
        var school = await School.create(req.body, {include: [Account]})
        school.dataValues.token = await school.account.generateAuthToken()
        res.status(201).send(school)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

/* post Classes
/alhbd/2020-2021/classes/add
{"classes":[1,3,5]}
 */
router.post('/:siteName/:startYear-:endYear/classes/add', auth, async (req, res) => {
    try {
        var school = req.account.school
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
router.get('/:siteName/:startYear-:endYear/classes', auth, async (req, res) => {
    try {
        var school = await School.findByCriteriaInPeriod(req.account.school.id
            , req.params.startYear, req.params.endYear)


        res.send({schoolClasses: school.schoolClasses})
    } catch (e) {
        console.log(e.message)
        res.status(400).send(e.message)
    }
})

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
            var className = req.params.className.replace('_', ' ')
            var schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
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
            var className = req.params.className.replace('_', ' ')

            var schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
                req.params.endYear, className)

            res.send({classrooms:schoolClass.classrooms})
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
            var className = req.params.className.replace('_', ' ')

            var classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
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
            var className = req.params.className.replace('_', ' ')

            var classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
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
        var className = req.params.className.replace('_', ' ')

        var schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
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

//getting a school subjects
/*
example
{{url}}/Raghad/subjects
*/
router.get('/:siteName/subjects', async (req, res) => {
    try {
        var schoolName = req.params.siteName
        var school = await SubjectInYear.findAll({
            include: {
                association: 'schoolClass',
                include: {
                    association: 'school', where: {schoolName}
                }
            }
        })
        res.status(200).send(school)
    } catch (e) {
        console.log(e)
        res.status(500).send('Failed to fetch subjects for ' + schoolName)
    }
})

module.exports = router