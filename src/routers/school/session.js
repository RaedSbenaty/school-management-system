const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Absence = require('../../models/session/absence')
const Session = require('../../models/session/session')

/*
 post sessions
 /alhbd/2020-2021/sessions/add
{
   "classroomId":1,
   "sessions":[
        {
            "subjectInSemesterId": 1,
             "teacherInClassId":1,
             "dayId":1
        }
   ]
}
 */
router.post('/:siteName/:startYear-:endYear/sessions/add', auth(['School']), async (req, res) => {
    try {
        for (const session of req.body.sessions)  await Session.create({...session, classroomId: req.body.classroomId})
        res.status(201).send('Adding session is Done.')
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