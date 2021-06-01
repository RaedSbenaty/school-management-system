var express = require('express')
var { Op } = require('sequelize')
var router = express.Router()

var School = require('../models/school')
var Account = require('../models/account')
var Class = require('../models/class')
var SchoolClass = require('../models/schoolClass')
var Classroom = require('../models/classroom')

var auth = require('../middlewares/auth')


//example
/*
{
        "schoolName": "Raghad",
        "location": "midan",
        "foundationDate": "08-05-2021",
        "facebookPage": "https://www.facebook.com/AlHudoodNet/",
        "siteName": "alhbd",
        "account": {
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
        req.body.account.siteName = req.body.schoolName
        var school = await School.create(req.body, { include: [Account] })
        school.dataValues.token = await school.account.generateAuthToken()
        res.status(201).send(school)
    } catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed.')
    }
})

/*
/alhbd/2020-2021/classes/add
{"classes":[1,3,5]}
 */
router.post('/:schoolName/:startYear-:endYear/classes/add', auth, async (req, res) => {
    try {
        var school = await School.findOne({
            include: [SchoolClass],
            where: { siteName: req.params.schoolName },
        })

        for (let classId of req.body.classes) {
            var { startYear, endYear } = req.params
            await school.createSchoolClass({ classId, startYear, endYear })
        }

        res.send(`Classes with id: ${req.body.classes} were added.`)
    } catch (e) {
        console.log(e)
        res.status(200).send('Unable to add all classes for this school.')
    }
})

///alhbd/2020-2021/classes
router.get('/:schoolName/:startYear-:endYear/classes', auth, async (req, res) => {
    var { startYear, endYear } = req.params
    try {
        var school = await School.findOne({
            include: {
                association: 'schoolClasses', include: 'class',
                where: { startYear: { [Op.gte]: startYear || 0 }, endYear: { [Op.lte]: endYear || 99999 } }
            },
            where: { siteName: req.params.schoolName }
        })
        res.send(school.schoolClasses)
    } catch (e) {
        console.log(e)
        res.status(404).send('Unable to get classes for this school.')
    }
})


/*
/alhbd/2020-2021/classes/3/classrooms/add
{
classrooms:[
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
router.post('/:schoolName/:startYear-:endYear/classes/:classId/classrooms/add',
    auth, async (req, res) => {
        try {
            var searchClass = { ...req.params }
            delete searchClass.schoolName

            var schoolClass = await SchoolClass.findByCriteria(req.params.schoolName, searchClass)
            for (let classroom of req.body.classrooms)
                await schoolClass.createClassroom(classroom)

            res.send(`Classrooms were added for classId: ${req.params.classId} `)
        } catch (e) {
            console.log(e)
            res.status(400).send('Unable to add all classrooms for this class.')
        }
    })


/*
/alhbd/2020-2021/classes/3/classrooms
 */
router.get('/:schoolName/:startYear-:endYear/classes/:classID/classrooms'
    , auth, async (req, res) => {
        try {
            var searchClass = { ...req.params }
            delete searchClass.schoolName

            var schoolClass = await SchoolClass.findByCriteria(req.params.schoolName, searchClass)
            res.send(schoolClass.classrooms)
        } catch (e) {
            console.log(e)
            res.status(404).send('Classrooms not found.')
        }
    })

/*
/alhbd/2020-2021/classes/3/classrooms/1
{
    "classroom":{
    "studentsNumber": 400
    }
}
 */
router.patch('/:schoolName/:startYear-:endYear/classes/:classID/classrooms/:classroomNumber'
    , auth, async (req, res) => {
        try {
            var searchClass = { ...req.params }
            delete searchClass.schoolName
            delete searchClass.classroomNumber

            var classroom = await Classroom.findByCriteria(req.params.schoolName, searchClass, req.params.classroomNumber)
            await classroom.update(req.body.classroom)
            res.send(`Classroom with number ${req.params.classroomNumber} was edited.`)
        } catch (e) {
            console.log(e)
            res.status(400).send('Deletion failed.')
        }
    })

/*
//alhbd/2020-2021/classes/3/classrooms/2
 */
router.delete('/:schoolName/:startYear-:endYear/classes/:classID/classrooms/:classroomNumber'
    , auth, async (req, res) => {
        try {
            var searchClass = { ...req.params }
            delete searchClass.schoolName
            delete searchClass.classroomNumber

            var classroom = await Classroom.findByCriteria(req.params.schoolName, searchClass, req.params.classroomNumber)
            await classroom.destroy()

            res.send(`Classroom with number ${req.params.classroomNumber} was deleted.`)
        } catch (e) {
            console.log(e)
            res.status(400).send('Deletion failed.')
        }
    })

module.exports = router