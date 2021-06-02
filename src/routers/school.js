var express = require('express')
var {Op} = require('sequelize')
var router = express.Router()

var School = require('../models/school')
var Account = require('../models/account')
var Class = require('../models/class')
var SchoolClass = require('../models/schoolClass')
var Classroom = require('../models/classroom')

var auth = require('../middlewares/auth')


//example
/*
{{
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
        school.dataValues.token = school.account.generateAuthToken()
        res.status(201).send(school)
    } catch (e) {
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
        console.log(e.message)
        res.status(400).send(e.message)
    }
})
/* get Classes
/alhbd/2020-2021/classes
 */
router.get('/:siteName/:startYear-:endYear/classes', auth, async (req, res) => {
    try {
        var school = await School.findByCriteriaInPeriod(req.account.school.id
            , req.params.startYear, req.params.endYear)

        res.send(school.schoolClasses)
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

            await schoolClass.createClassrooms(req.body.classrooms)
            res.send(`Classrooms were added for ${className}.`)
        } catch (e) {
            console.log(e.message)
            res.status(400).send(e.message)
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

            res.send(schoolClass.classrooms)
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

module.exports = router