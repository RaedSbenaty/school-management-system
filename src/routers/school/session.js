const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Absence = require('../../models/session/absence')
const Session = require('../../models/session/session')
const Day = require('../../models/day')
const Classroom = require('../../models/class/classroom')


/*
 post sessions
 /alhbd/2020-2021/sessions/add
{
   "classroomId":1,
   "sessions":[
        {
            "subjectInSemesterId": 1,
             "teacherInClassId":1,
             "dayId":1,
             "startTime":"9:30",
             "endTime":"11:30"
        }
   ]
}
 */
router.post('/:siteName/:startYear-:endYear/sessions/add', auth(['School']), async (req, res) => {
    try {
        for (const session of req.body.sessions) await Session.create({...session, classroomId: req.body.classroomId})
        res.status(201).send('Adding session is Done.')
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

// get schedule for a classroom in a semester
// /alhbd/2020-2021/classes/Preschool/classrooms/1/semesters/1/sessions
router.get('/:siteName/:startYear-:endYear/classes/:className/classrooms/:classroomNumber' +
    '/semesters/:semesterNumber/sessions', auth(['School']), async (req, res) => {
    try {
        const className = req.params.className.replace('_', ' ')
        const classroom = await Classroom.findByCriteria(req.account.school.id, req.params.startYear,
            req.params.endYear, className, req.params.classroomNumber)

        const schedule = await Day.getScheduleForClassroomInSemester(classroom.id, req.params.semesterNumber)

        for (const day of schedule)
            for (const session of day.sessions) {
                session.dataValues.subjectName = session.subjectInSemester.subjectInYear.name
                delete session.dataValues.subjectInSemester
                session.dataValues.teacher = session.teacherInClass.teacherInYear.teacherInSchool.teacher
                delete session.dataValues.teacherInClass
            }

        res.send(schedule)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})

/*
 post absences
 /alhbd/2020-2021/absences/add
[
    {
        "sessionId":null,
        "date": "1-1-2001",
        "reason": "Animaling",
        "studentInClassId": 1
    }
]
 */

router.post('/:siteName/:startYear-:endYear/absences/add', auth(['School']), async (req, res) => {
    try {
        await Absence.bulkCreate(req.body)
        res.status(201).send('Adding absences is Done.')
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


module.exports = router