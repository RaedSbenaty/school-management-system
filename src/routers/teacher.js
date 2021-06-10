var express = require('express')
var router = express.Router()
var Teacher = require('../models/teacher')
var Account = require('../models/account')
var PersonalInfo = require('../models/personalInfo')


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
        var teacher = await Teacher.create(req.body, {include: [Account, PersonalInfo]})
        teacher.dataValues.token = teacher.account.generateAuthToken()
        res.status(201).send(teacher)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

module.exports = router


// post New Teacher
// /alhbd/2020-2021/teachers/add
router.post('/:siteName/:startYear-:endYear/teachers/add', async (req, res) => {
    try {
        req.body.account.user = 'Teacher'
        var teacher = await Teacher.create(req.body, {include: [Account, PersonalInfo]})
        await TeacherInSchool.create({teacherId: teacher.id, schoolId: req.account.school.id})
        res.status(201).send(teacher)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})
module.exports = router