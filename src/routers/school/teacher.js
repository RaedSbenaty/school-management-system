const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const Teacher = require('../../models/teacher/teacher')
const TeacherInSchool = require('../../models/teacher/teacherInSchool')

// post New Teacher
// /alhbd/2020-2021/teachers/add
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

router.post('/:siteName/:startYear-:endYear/teachers/add', auth(['School']), async (req, res) => {
    try {
        req.body.account.user = 'Teacher'
        const teacher = await Teacher.create(req.body, {include: ['account', 'personalInfo']})
        await TeacherInSchool.create({teacherId: teacher.id, schoolId: req.account.school.id})
        res.status(201).send(teacher)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

module.exports = router