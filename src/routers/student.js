const express = require('express')
const router = express.Router()
const {Op} = require('sequelize')
const auth = require('../middlewares/auth')
const belongsTo = require('../middlewares/studentBelongsToSchool')

const Student = require('../models/student/student')
const Announcement = require('../models/announcement/announcement')
const Absence = require('../models/session/absence')
const SchoolClass = require('../models/class/schoolClass')
const StudentInClass = require('../models/student/studentInClass')

//example
/*
{
        "fatherName": "Aamer",
        "motherName": "Hanaa",   
        "lastSchoolAttended": "Bla",
        "classId": 5,
        "account": {
        "email": "abd@hbd.com",
        "password": "12345678",
        "phoneNumber": "+961994418888"
        },
        "personalInfo": {
        "firstName": "Raghad",
        "lastName": "Al-Halabi",
        "birthDate": "04-17-2001",
        "residentialAddress": "Damascus"
        }
}
*/

//sign up
router.post('/students/signup', async (req, res) => {
    try {
        req.body.account.user = 'Student'
        const student = await Student.create(req.body, {include: ['account', 'personalInfo']})
        student.dataValues.token = await student.account.generateAuthToken()
        res.status(201).send(student)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

// get schools for a student
// /students/1/schools
router.get('/students/:studentId/schools', auth(['Student']), async (req, res) => {
    try {
        const schoolClasses = await SchoolClass.findAll({
            attributes: ['startYear', 'endYear'], include: {
                association: 'studentInClasses', attributes: ['createdAt'], required: true, include: {
                    association: 'studentInSchool', attributes: ['active'], where: {studentId: req.params.studentId},
                    include: {
                        association: 'school', attributes: ['id', 'schoolName'], required: true,
                        include: {association: 'account', attributes: ['siteName'], required: true}
                    }
                }
            }
        })
        res.send(schoolClasses)
    } catch (e) {
        console.log(e)
        res.status(500).send('Failed to fetch schools for this student.')
    }
})


// get announcements for a student
// /students/1/alhbd/2020-2021/announcements

router.get('/students/:studentId/:siteName/:startYear-:endYear/announcements', auth(['Student']), belongsTo, async (req, res) => {
    try {
        const announcements = await Announcement.findAll({
            where: {
                startYear: req.params.startYear, endYear: req.params.endYear,
                [Op.or]: [
                    {destinationStudentInClassId: {[Op.eq]: req.studentInClass.id}},
                    {destinationSchoolClassId: {[Op.eq]: req.studentInClass.schoolClassId}},
                    {
                        destinationClassroomId: {
                            [Op.and]: [{[Op.eq]: req.studentInClass.classroomId}, {[Op.not]: null}]
                        }
                    }
                ]
            }, include: {association: 'attachments', attributes: ['path']}
        })
        res.send(announcements)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


// get absences for a student
// /students/1/alhbd/2020-2021/absences

router.get('/students/:studentId/:siteName/:startYear-:endYear/absences', auth(['Student']), belongsTo, async (req, res) => {
    try {
        const absences = await Absence.findAll({where: {studentInClassId: req.studentInClass.id}})
        res.send(absences)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


module.exports = router