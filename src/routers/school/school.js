const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')

const School = require('../../models/school')
const Account = require('../../models/account')
const Announcement = require('../../models/announcement/announcement')
const Attachment = require('../../models/announcement/attachment')


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
        school.account.sendMail('Welcome To Schoolink!', 'Have a nice experience, hbedo')
        school.dataValues.token = await school.account.generateAuthToken()
        res.status(201).send(school)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})




module.exports = router