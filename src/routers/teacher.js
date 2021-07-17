const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')


const Teacher = require('../models/teacher/teacher')

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
        const teacher = await Teacher.create(req.body, {include: ['account', 'personalInfo']})
        teacher.dataValues.token = await teacher.account.generateAuthToken()
        res.status(201).send(teacher)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


//get teacher's info
// /teacher/1/info
router.get('/teachers/:teacherId/info', auth(['Teacher']), async (req, res) => {
    try {
        res.status(201).send(req.account)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})



module.exports = router