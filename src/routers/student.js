const express = require('express')
const router = express.Router()
const Student = require('../models/student')
var auth = require('../middleware/auth')

//sign up
router.post('/signup/students', async (req, res) => {
    try {
        var student = await Student.create(req.body.Student)
        var personal_info = await student.createPersonal_Info(req.body.personal_info)
        var account = await student.createAccount(req.body.account)

        res.status(201).send({personal_info, student, account, token: account.generateAuthToken() })
    }
    catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed')
    }
})

module.exports = router