const express = require('express')
const router = express.Router()
const Student = require('../models/student')
const auth = require('../middleware/auth')

//example
/*
{
    "student": {
        "fatherName": "Aamer",
        "motherName": "Hanaa",   
        "lastSchoolAttended": "Bla",
        "lastDegree": "bachleor"           //optional
    },
    "personal_info": {
        "firstName": "Raghad",
        "lastName": "Al-Halabi",
        "birthDate": "04-17-2001",
        "residentialAddress": "Damascus"
    },
    "account": {
        "email": "abd@hbd.com",
        "password": "12345678",
        "phoneNumber": "+961994418888",
        "personalImage": ""                 //optional

    }
}
*/

//sign up
router.post('/signup/students', async (req, res) => {
    try {
        var student = await Student.create(req.body.student)
        var personal_info = await student.createPersonal_Info(req.body.personal_info)
        var account = await student.createAccount(req.body.account)

        res.status(201).send({ personal_info, student, account, token: account.generateAuthToken() })
    }
    catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed')
    }
})

module.exports = router