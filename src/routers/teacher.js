var express = require('express')
var router = express.Router()
var Teacher = require('../models/teacher')
var Account = require('../models/account')
var auth = require('../middlewares/auth')

/*
{
    "personal_info":{
    "firstName": "Raed",
    "lastName": "Sbenaty",
    "birthDate": "04-17-2001",
    "residentialAddress": "Damascus"
    },
    "studying_data" : {
           "certification": "PHD. HBD"
    },
    "account" : {
        "email": "raed@hbd.com",
        "password": "12345678",
        "phoneNumber": "+963994418123",
    }
}
 */

router.post('/signup/teachers', async (req, res) => {
    try {
        req.body.account.user = 'Teacher'
        var account = await Account.create(req.body.account)

        var teacher = await Teacher.create(req.body.studying_data)
        await teacher.setAccount(account)

        var personal_info = await teacher.createPersonal_Info(req.body.personal_info)
        res.status(201).send({ personal_info, teacher, account, token: account.generateAuthToken() })
    } catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed.')
    }
})

module.exports = router