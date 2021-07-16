const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const auth = require('../../middlewares/auth')

const School = require('../../models/school/school')
const Account = require('../../models/account')
const Announcement = require('../../models/announcement/announcement')
const Attachment = require('../../models/announcement/attachment')
const Class = require('../../models/class/class')
const GeneralInfo = require('../../models/school/generalInfo')
const  Session  = require('../../models/session/session')



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
        const school = await School.create(req.body, { include: [Account] })
        school.account.sendMail('Welcome To Schoolink!', 'Have a nice experience, hbedo')
        school.dataValues.token = await school.account.generateAuthToken()
        res.status(201).send(school)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})

//school general information
/*
example
/alhbd/2020-2021/generalInfo/add

{
    "startTime": "01:00",
    "breakFrequency": "2",
    "breakDuration": "15",
    "sessionDuration": "45",
    "activeDays": [1,2,3,4]
}
*/
router.post('/:siteName/:startYear-:endYear/generalInfo/add',
    auth(['School']), async (req, res) => {
        try {
            let session = await School.findAll({
                subQuery: false,
                where: {
                    id: req.account.school.id,
                }, include: {
                    association: 'schoolClasses', required: true,
                    include: {
                        association: 'classrooms', required: true,
                        include: {
                            association: 'sessions', required: true
                        }
                    }
                }
            })
            if (session.length)
                return res.status(400).send('Consider changing schedules before changing this information.')
                let days = req.body.activeDays
                delete req.body.activeDays
               
                days.forEach(element => {
                   req.body.Days= []
                   req.body.Days.push({"id": element})
                });
           req.body.schoolId = req.account.school.id

           console.log(req.body);

            await GeneralInfo.create(req.body)
            res.status(201).send('School general Information has been successfully added.')
        } catch (e) {
            console.log(e)
            res.status(400).send(e.message.split(','))
        }
    })


module.exports = router