var express = require('express')
var { Op } = require('sequelize')
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
        var school = await School.create(req.body, { include: [Account] })
        school.dataValues.token = await school.account.generateAuthToken()
        console.log(school.dataValues.token);
        res.status(201).send(school)
    } catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed.')
    }
})

/* post Classes
/alhbd/2020-2021/classes/add
{"classes":[1,3,5]}
 */
router.post('/:schoolName/:startYear-:endYear/classes/add', auth, async (req, res) => {
    try {
        var school = await School.findOne({
            include: [SchoolClass],
            where: { id: req.account.school.id },
        })

        for (let classId of req.body.classes) {
            var { startYear, endYear } = req.params
            var s = await school.createSchoolClass({ classId, startYear, endYear })
            console.log(s);
        }

        res.send(`Classes with id: ${req.body.classes} were added.`)
    } catch (e) {
        console.log(e)
        res.status(200).send('Unable to add all classes for this school.')
    }
})
/* get Classes
/alhbd/2020-2021/classes
 */
router.get('/:schoolName/:startYear-:endYear/classes', auth, async (req, res) => {
    try {
        var school = await School.findByCriteriaInPeriod(req.account.school.id
            , req.params.startYear, req.params.endYear)

        res.send(school.schoolClasses)
    } catch (e) {
        console.log(e)
        res.status(404).send('Unable to get classes for this school.')
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
router.post('/:schoolName/:startYear-:endYear/classes/:className/classrooms/add',
    auth, async (req, res) => {
        try {
            var className = req.params.className.replace('_', ' ')

            var schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
                req.params.endYear, req.params.className)

            for (let classroom of req.body.classrooms)
                await schoolClass.createClassroom(classroom)

            res.send(`Classrooms were added for ${className}.`)
        } catch (e) {
            console.log(e)
            res.status(400).send('Unable to add all classrooms for this class.')
        }
    })


/* get Classrooms
/alhbd/2020-2021/classes/Second_Grade
 */
router.get('/:schoolName/:startYear-:endYear/classes/:className/classrooms'
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
router.patch('/:schoolName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber'
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
router.delete('/:schoolName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber'
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
{
    "subjects": [
        {
            "categoryId": 1,
            "name": "bla",
            "semesters": [1,2]
        }
    ]
}
*/
router.post('/:schoolName/:startYear-:endYear/subjects/:className/add', auth, async (req, res) => {
    try {
        var className = req.params.className.replace('_', ' ')

        var schoolClass = await SchoolClass.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className)

        for (let subject of req.body.subjects) {
            subjectInYear = await schoolClass.createSubjectInYear(subject.name, subject.categoryId)
        }
        //     for (let semester of subject.semesters)
        //         await subjectInYear.createSubjectInSemester(semester)
        // }



        res.send(`Subjects were added for classID: ${req.params.classID}.`)
    } catch (e) {
        console.log(e)
        res.status(200).send('Unable to add all subjects.')
    }
})

module.exports = router