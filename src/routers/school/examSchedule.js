const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const Classroom = require('../../models/class/classroom')
const SchoolClass = require('../../models/class/schoolClass')
const ClassroomExamSchedule = require('../../models/exam/classroomExamSchedule')
const ExamSchedule = require('../../models/exam/examSchedule')
const ScheduledExam = require('../../models/exam/scheduledExam')
const SubjectInSemester = require('../../models/subject/subjectInSemester')

//adding examSchedule for a classroom or a schoolClass
/*
example
/alhbd/2020-2021/examSchedule/add

{
    "classroomId": 1,
    "scheduledExams": [
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
        for (let index = 0; index < req.body.scheduledExams.length; index++) {
            const subject = await SubjectInSemester.findByPk(req.body.scheduledExams[index].subjectInSemesterId)

            if (!subject)
                return res.status(404).send('This school does not have a subject with Id: ' + req.body.scheduledExams[index].subjectInSemesterId)
        }

        //bonding with classroom or classrooms for a class
        if (req.body.classroomId) {
            req.body.scheduleType = 'Classroom'
            let examSchedule = await ExamSchedule.create(req.body, { include: ['scheduledExams'] })

            await ClassroomExamSchedule.create({ classroomId: req.body.classroomId, examScheduleId: examSchedule.id })
        }

        else if (req.body.schoolClassId) {
            req.body.scheduleType = 'Class'
            let examSchedule = await ExamSchedule.create(req.body, { include: ['scheduledExams'] })

            let promises = []
            for (let j = 0; j < schoolClass.classrooms.length; j++)
                promises.push(ClassroomExamSchedule.create({ classroomId: schoolClass.classrooms[j].id, examScheduleId: examSchedule.id }))

            await Promise.all(promises)

        }

        res.status(201).send('ExamSchedule has been set successfully.')

    } catch (e) {
        console.log(e)
        res.status(400).send(e.message.split(','))
    }
})

// get examSchedule for a classroom
// /alhbd/2021-2022/classroom/1/examSchedule/get
router.get('/:siteName/:startYear-:endYear/classroom/:classroomId/examSchedule/get', auth(['School'])
    , async (req, res) => {
        try {
            let classroomSchedule = await SchoolClass.findAll({
                subQuery: false,
                where: { startYear: req.params.startYear, endYear: req.params.endYear }, attributes: ['id'], include: {
                    association: 'classrooms', attributes: ['id'], where: { id: req.params.classroomId }, include: {
                        association: 'examSchedules', attributes: ['id'], include: {
                            association: 'scheduledExams', attributes: ['id', 'date', 'startTime', 'endTime'],include:{
                                association:'subjectInSemester', attributes:['id'],include:{
                                    association:'subjectInYear', attributes:['name'],required: true
                                },required: true,
                            },
                            required: true
                        }, required: true
                    }, required: true
                }
            })

            if (!classroomSchedule.length)
                return res.status(404).send('No exam schedule was found for the specified classroom in the specified year.')
              
                let arr =[]
                classroomSchedule[0].classrooms[0].examSchedules.forEach(element => {
                    arr.push(element.scheduledExams)
                })
                res.status(201).send(arr)

        } catch (e) {
            console.log(e)
            res.status(400).send(e.message.split(','))
        }
    })

// get examSchedule for a schoolClass
// /alhbd/2021-2022/class/1/examSchedule/get
router.get('/:siteName/:startYear-:endYear/class/:schoolClassId/examSchedule/get', auth(['School'])
    , async (req, res) => {
        try {
            let schoolClassSchedule = await SchoolClass.findAll({
                subQuery: false,
                where: { id: req.params.schoolClassId, startYear: req.params.startYear, endYear: req.params.endYear }, attributes: ['id'], include: {
                    association: 'classrooms', attributes: ['id'], include: {
                        association: 'examSchedules', attributes: ['id'], where: { scheduleType: 'class' }, include: {
                            association: 'scheduledExams', attributes: ['id', 'date', 'startTime', 'endTime'],include:{
                                association:'subjectInSemester', attributes:['id'],include:{
                                    association:'subjectInYear', attributes:['name'],required: true
                                },required: true,
                            },
                            required: true
                        }, required: true
                        , required: true
                    }, required: true
                }
            })

            if (!schoolClassSchedule.length)
                return res.status(404).send('No exam schedule was found for the specified school class in the specified year.')

            let arr = []
            schoolClassSchedule[0].classrooms[0].examSchedules.forEach(element => {
                arr.push(element.scheduledExams)
            })
            res.status(201).send(arr)
        }
        catch (e) {
            console.log(e)
            res.status(400).send(e.message.split(','))
        }

    })


module.exports = router