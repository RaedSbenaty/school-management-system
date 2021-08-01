const express = require('express')
const router = express.Router()
const {Op} = require('sequelize')
const auth = require('../middlewares/auth')
const belongsTo = require('../middlewares/studentBelongsToSchool')

const Student = require('../models/student/student')
const Teacher = require('../models/teacher/teacher')
const Announcement = require('../models/announcement/announcement')
const Absence = require('../models/session/absence')
const Day = require('../models/session/day')
const SchoolClass = require('../models/class/schoolClass')
const SubjectInSemester = require('../models/subject/subjectInSemester')
const InLocoParentis = require('../models/inLocoParentis')


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
    },
        "inLocoParentis": {
        "account": {
            "user":"InLocoParentis",
            "email": "inLocoParentis@gmail.com",
            "password": "57239000",
            "phoneNumber": "+963994418888"
        },
        "personalInfo": {
            "firstName": "Bayan",
            "lastName": "Al-Halabi",
            "birthDate": "04-09-1997",
            "residentialAddress": "Damascus"
        }
    }
}
*/


//sign up
router.post('/students/signup', async (req, res) => {
    try {
        req.body.account.user = 'Student'
        const student = await Student.create(req.body, {
            include: [{association: 'account'}, {association: 'personalInfo'},
                {association: 'inLocoParentis', include: ['account', 'personalInfo']}]
        })
        student.dataValues.token = await student.account.generateAuthToken()
        res.status(201).send(student)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


//get student's info
// /students/1/info
router.get('/students/:studentId/info', auth(['Student']), async (req, res) => {
    try {
        res.status(201).send(req.account)
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
            attributes: ['sourceSchoolId', 'sourceTeacherInYearId', 'heading', 'body', 'date'], where: {
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


// get student marks (in every semester in a year)
// /students/1/alhbd/2020-2021/marks
router.get('/students/:studentId/:siteName/:startYear-:endYear/marks', auth(['Student']), belongsTo, async (req, res) => {
    try {
        const studentMarks = await SubjectInSemester.getStudentMarksInSemester(req.studentInClass.id, req.studentInClass.schoolClassId)
        res.send(studentMarks)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

// get schedule for a classroom in a semester
// /students/1/alhbd/2020-2021/semesters/1/sessions
router.get('/students/:studentId/:siteName/:startYear-:endYear/semesters/:semesterNumber/sessions',
    auth(['Student']), belongsTo, async (req, res) => {
        try {
            const schedule = await Day.getScheduleForClassroomInSemester(req.studentInClass.classroomId, req.params.semesterNumber)
            res.send(schedule)
        } catch (e) {
            console.log(e)
            res.status(500).send(e.message)
        }
    })


// get examSchedule for a student
// /students/1/alhbd/2020-2021/examSchedule
router.get('/students/:studentId/:siteName/:startYear-:endYear/examSchedule', auth(['Student']),
    belongsTo, async (req, res) => {
        try {
            const classroomSchedule = await SchoolClass.findAll({
                where: {startYear: req.params.startYear, endYear: req.params.endYear}, attributes: ['id'], include: {
                    association: 'classrooms', attributes: ['id'], where: {id: req.studentInClass.classroomId}
                    , required: true, include: {association: 'examSchedules', required: true}
                }
            })
            if (!classroomSchedule.length)
                return res.status(404).send('No exam schedule was found for the specified classroom in the specified year.')
            res.status(201).send(classroomSchedule[0].classrooms[0].examSchedules)
        } catch (e) {
            console.log(e)
            res.status(500).send(e.message)
        }
    })


// get teachers for a student in a semester
// /students/1/alhbd/2020-2021/semesters/1/teachers
router.get('/students/:studentId/:siteName/:startYear-:endYear/semesters/:semesterNumber/teachers',
    auth(['Student']), belongsTo, async (req, res) => {
        try {
            const teachers = await Teacher.findAll({
                attributes: ['id'], include: [
                    {association: 'personalInfo', attributes: ['firstName', 'lastName']},
                    {association: 'account', attributes: ['email', 'phoneNumber']},
                    {
                        association: 'teacherInSchools', attributes: ['id'], required: true, include: {
                            association: 'teacherInYears', attributes: ['id'], required: true, include: {
                                association: 'teacherInClasses', attributes: ['id'], required: true, include: {
                                    association: 'sessions', attributes: ['id'],
                                    where: {classroomId: req.studentInClass.classroomId},
                                    include: {
                                        association: 'subjectInSemester', attributes: ['id'],
                                        where: {semester: req.params.semesterNumber},
                                        include: {association: 'subjectInYear', attributes: ['name']}
                                    }
                                }
                            }
                        }
                    }
                ]
            })

            for (const teacher of teachers) {
                const sessions = teacher.teacherInSchools[0].teacherInYears[0].teacherInClasses[0].sessions
                delete teacher.dataValues.teacherInSchools
                const subjectsSet = new Set()
                sessions.forEach(session => subjectsSet.add(session.subjectInSemester.subjectInYear.name))
                teacher.dataValues.subjects = Array.from(subjectsSet)
            }

            res.send(teachers)
        } catch (e) {
            console.log(e)
            res.status(500).send(e.message)
        }
    })


module.exports = router