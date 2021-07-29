const express = require('express')
const router = express.Router()
const {Op} = require('sequelize')
const auth = require('../middlewares/auth')
const belongsTo = require('../middlewares/teacherBelongsToSchool')

const Teacher = require('../models/teacher/teacher')
const Announcement = require('../models/announcement/announcement')
const Absence = require('../models/session/absence')
const SchoolClass = require('../models/class/schoolClass')
const TeacherInYear = require('../models/teacher/teacherInYear')


/*
{
    "certification": "PHD. HBD",
    "personalInfo":{
    "firstName": "Raed",
    "lastName": "Sbenaty",
    "birthDate": "04-17-2001",
    "residentialAddress": "Damascus"
    },
    "account" : {
        "email": "raed@hbd.com",
        "password": "12345678",
        "phoneNumber": "+963994418123"
    }
}
 */

router.post('/teachers/signup', async (req, res) => {
    try {
        req.body.account.user = 'Teacher'
        const teacher = await Teacher.create(req.body, {include: ['account', 'personalInfo']})
        teacher.dataValues.token = await teacher.account.generateAuthToken()
        res.status(201).send(teacher)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


//get teacher's info
// /teacher/1/info
router.get('/teachers/:teacherId/info', auth(['Teacher']), async (req, res) => {
    try {
        res.status(201).send(req.account)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

// get announcements for a teacher
// /teachers/1/alhbd/2020-2021/announcements
router.get('/teachers/:teacherId/:siteName/:startYear-:endYear/announcements', auth(['Teacher']), belongsTo, async (req, res) => {
    try {
        const announcements = await Announcement.findAll({
            attributes: ['sourceSchoolId', 'sourceStudentInClassId'], where: {
                startYear: req.params.startYear, endYear: req.params.endYear,
                destinationTeacherInYearId: req.teacherInYear.id
            }, include: {association: 'attachments', attributes: ['path']}
        })
        res.send(announcements)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


// get absences for a teacher
// /teachers/1/alhbd/2020-2021/absences
router.get('/teachers/:teacherId/:siteName/:startYear-:endYear/absences', auth(['Teacher']), belongsTo, async (req, res) => {
    try {
        const absences = await Absence.findAll({where: {teacherInYearId: req.teacherInYear.id}})
        res.send(absences)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


// get classes for a teacher in a year
// /teachers/1/alhbd/2020-2021/classes
router.get('/teachers/:teacherId/:siteName/:startYear-:endYear/classes', auth(['Teacher']), belongsTo, async (req, res) => {
    try {
        const classes = await TeacherInYear.findAll({where: {id: req.teacherInYear.id},required: true, include:{
            association: 'teacherInClasses', attributes: ['schoolClassId']
        }})
        res.send(classes)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

module.exports = router