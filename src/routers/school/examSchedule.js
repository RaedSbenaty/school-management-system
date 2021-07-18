const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const Classroom = require('../../models/class/classroom')
const SchoolClass = require('../../models/class/schoolClass')
const ClassroomExamSchedule = require('../../models/classroomExamSchedule')
const ExamSchedule = require('../../models/examSchedule')
const SubjectInSemester = require('../../models/subject/subjectInSemester')

//adding examSchedule for a classroom or a schoolClass
/*
example
/alhbd/2020-2021/classes/examSchedule/add

{
    "classroomId": 1,
    "Schedule": [
        {
            "subjectInSemesterId": 1,
            "date": "07-04-2021",
            "startTime": "01:30",
            "endTime": "05:50"
        }
    ]
}
*/

router.post('/:siteName/:startYear-:endYear/examSchedule/add', auth(['School']), async (req, res) => {
    try {
        var classroom, schoolClass
        //checking the classroom existence
        if (req.body.classroomId) {
            classroom = await Classroom.findByPk(req.body.classroomId)
            if (!classroom)
                return res.status(404).send('This school does not have a classroom with Id: ' + req.body.classroomId)
        }

        //checking the schoolClass existence
        else if (req.body.schoolClassId) {
            schoolClass = await SchoolClass.findOne({ where: { id: req.body.schoolClassId }, include: [Classroom] })
            if (!schoolClass)
                return res.status(404).send('This school does not have a class with Id: ' + req.body.schoolClassId)
        }

        //checking the subject existence
        for (let index = 0; index < req.body.schedule.length; index++) {
            const subject = await SubjectInSemester.findByPk(req.body.schedule[index].subjectInSemesterId)

            if (!subject)
                return res.status(404).send('This school does not have a subject with Id: ' + req.body.schedule[index].subjectInSemesterId)
        }

        for (let index = 0; index < req.body.schedule.length; index++) {
            let exam = await ExamSchedule.create(req.body.schedule[index])

            if (req.body.classroomId)
                await ClassroomExamSchedule.create({ classroomId: req.body.classroomId, examScheduleId: exam.id })
            if (req.body.schoolClassId) {
                exam.etype = 'class'
                exam.save()
                for (let j = 0; j < schoolClass.classrooms.length; j++) {
                    let i = schoolClass.classrooms[j].id
                    await ClassroomExamSchedule.create({ classroomId: schoolClass.classrooms[j].id, examScheduleId: exam.id })

                }
            }
        }

        res.status(201).send('ExamSchedule has been set successfuly.')

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message.split(','))
    }
})

// get examSchedule for a classroom
// /alhbd/classroom/1/examSchedule/get
router.get('/:siteName/classroom/:classroomId/examSchedule/get', auth(['School'])
    , async (req, res) => {
        try {
            let classroomExamSchedule = await Classroom.findOne({ where: { id: req.params.classroomId }, include: [ExamSchedule] })
            res.send(classroomExamSchedule)
        } catch (e) {
            console.log(e)
            res.status(400).send(e.message.split(','))
        }
    })

// // get examSchedule for a schoolClass
// // /alhbd/class/1/examSchedule/get
router.get('/:siteName/class/:schoolClassId/examSchedule/get', auth(['School'])
    , async (req, res) => {
        try {
            let schoolClassSchedule = await SchoolClass.findOne({
                subQuery: false,
                where: { id: req.params.schoolClassId }, attributes: ['id'], include: {
                    association: 'classrooms', attributes: ['id'], include: {
                        association: 'examSchedules', where: { etype: 'class' }, required: true
                    }, required: true
                }
            })
            res.status(201).send(schoolClassSchedule)
        }
        catch (e) {
            console.log(e)
            res.status(400).send(e.message.split(','))
        }

    })


module.exports = router