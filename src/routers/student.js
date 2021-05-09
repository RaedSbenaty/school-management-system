const express = require('express')
const router = express.Router()
const Student = require('../models/student')
var Account = require('../models/account')
const auth = require('../middlewares/auth')

//example
/*
{
    "student": {
        "fatherName": "Aamer",
        "motherName": "Hanaa",   
        "lastSchoolAttended": "Bla",
        "lastDegree": "bachleor"
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
        "personalImage": ""

    }
}
*/

//sign up
router.post('/signup/students', async (req, res) => {
    try {
        req.body.account.user = 'Student'
        var account = await Account.create(req.body.account)

        var student = await Student.create(req.body.student)
        await student.setAccount(account)

        var personal_info = await student.createPersonal_Info(req.body.personal_info)
        res.status(201).send({personal_info, student, account, token: account.generateAuthToken()})
    } catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed.')
    }
})

module.exports = router