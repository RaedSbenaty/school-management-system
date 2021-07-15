const express = require('express')
const router = express.Router()

const Student = require('../models/student/student')

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
        student.dataValues.token = student.account.generateAuthToken()
        res.status(201).send(student)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})



module.exports = router