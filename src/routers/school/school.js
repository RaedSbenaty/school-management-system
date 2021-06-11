const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const School = require('../../models/school')
const Account = require('../../models/account')
const StudentInSchool = require('../../models/student/studentInSchool')


//example
/*
{
        "schoolName": "Raghad",
        "location": "midan",
        "foundationDate": "08-05-2021",
        "facebookPage": "https://www.facebook.com/AlHudoodNet/",
        "account": {
        "siteName": "alhbd",
        "email": "dodeh@hbd.com",
        "password": "100009078",
        "phoneNumber": "+963944656499"
         }
}
*/

//sign up
router.post('/schools/signup', async (req, res) => {
    try {
        req.body.account.user = 'School'
        const school = await School.create(req.body, {include: [Account]})
        school.dataValues.token = await school.account.generateAuthToken()
        res.status(201).send(school)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

// get Students In a School (in a year)
// /alhbd/2020-2021/students
router.get('/:siteName/:startYear-:endYear/students', auth
    , async (req, res) => StudentInSchool.handleGetStudentsRequest(req, res))

module.exports = router