const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')

const School = require('../../models/school/school')
const Account = require('../../models/account')
const Announcement = require('../../models/announcement/announcement')
const GeneralInfo = require('../../models/school/generalInfo')
const ActiveDaysInGeneralInfo = require('../../models/school/ActiveDaysInGeneralInfo')
const Content = require('../../models/school/content')


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

//adding or updating school general information
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
router.patch('/:siteName/:startYear-:endYear/generalInfo/add',
    auth(['School']), async (req, res) => {

        //checking if there was a schedule for this school in this year
        try {
            let session = await School.findAll({
                subQuery: false,
                where: {
                    id: req.account.school.id,
                }, include: {
                    association: 'schoolClasses',
                    where: {startYear: req.params.startYear, endYear: req.params.endYear},
                    required: true,
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

            //formatting the request
            req.body.activeDaysInGeneralInfos = []

            req.body.activeDays.forEach(element => {
                req.body.activeDaysInGeneralInfos.push({dayId: element})
            });
            delete req.body.activeDays
            req.body.schoolId = req.account.school.id

            //checking if there was previous generalInfo in this year
            const generalInfo = await GeneralInfo.findOne({
                where: {schoolId: req.body.schoolId, startYear: req.params.startYear, endYear: req.params.endYear},
                include: [ActiveDaysInGeneralInfo]
            })

            //creating instances according to the previous result
            req.body.startYear = req.params.startYear
            req.body.endYear = req.params.endYear
            if (generalInfo) {
                let bla = generalInfo.activeDaysInGeneralInfos
                for (let index = 0; index < bla.length; index++) {
                    await bla[index].destroy()
                }
                await generalInfo.destroy()

                await GeneralInfo.create(req.body, {include: [ActiveDaysInGeneralInfo]})
            } else
                await GeneralInfo.create(req.body, {include: [ActiveDaysInGeneralInfo]})

            res.status(201).send('School general Information has been successfully added.')
        } catch (e) {
            console.log(e)
            res.status(400).send(e.message.split(','))
        }
    })

//getting school general information
/*
example
/alhbd/2020-2021/generalInfo/get
*/
router.get('/:siteName/:startYear-:endYear/generalInfo/get', auth(['School'])
    , async (req, res) => {
        try {
            const generalInfo = await GeneralInfo.findOne({
                where: {schoolId: req.account.school.id, startYear: req.params.startYear, endYear: req.params.endYear},
                include: [ActiveDaysInGeneralInfo]
            })
            if (!generalInfo)
                return res.status(404).send('No general information was found for the specified school in the specified year.')
            res.send(generalInfo)
        } catch (e) {
            console.log(e)
            res.status(400).send(e.message.split(','))
        }
    })

// post contents
// /alhbd/contents/add
/*
[
    {"type": "Primary", "header": "about us", "body": "phone: 123"},
    {"type": "Secondary", "header": "services", "body": "getStudents"}
]
 */
router.post('/:siteName/contents/add', auth(['School']), async (req, res) => {
    try {
        req.body.forEach(content => content.schoolId = req.account.school.id)
        await Content.bulkCreate(req.body)
        res.status(201).send('School contents has been successfully added.')
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


// get contents
// /alhbd/contents
router.get('/:siteName/contents', async (req, res) => {
    try {
        const school = await School.findOne({
            include: {association: 'account', where: {siteName: req.params.siteName}}
        })
        if (!school) return res.status(404).send('School not found.')
        const contents = await Content.findAll({where: {schoolId: school.id}})
        res.send(contents)
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


// patch content
// /alhbd/contents/1
/*
    {"type": "Secondary", "header": "about us", "body": "phone: 1234"}
 */
router.patch('/:siteName/contents/:contentId', auth(['School']), async (req, res) => {
    try {
        const content = await Content.findOne({where: {id: req.params.contentId}})
        if (!content || content.schoolId !== req.account.school.id) return res.status(400).send('Invalid content id.')
        await content.update(req.body)
        res.send('content has been successfully edited.')
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


// delete content
// /alhbd/2020-2021/contents/1
router.delete('/:siteName/contents/:contentId', auth(['School']), async (req, res) => {
    try {
        const content = await Content.findOne({where: {id: req.params.contentId}})
        if (!content || content.schoolId !== req.account.school.id) return res.status(400).send('Invalid content id.')
        await content.destroy()
        res.send('content has been successfully edited.')
    } catch (e) {
        console.log(e)
        res.status(500).send(e.message)
    }
})


// get announcements for a school
// /alhbd/2020-2021/announcements
router.get('/:siteName/:startYear-:endYear/announcements', auth(['School']), async (req, res) => {
    try {
        const announcements = await Announcement.findAll({
            attributes: ['sourceStudentInClassId', 'sourceTeacherInYearId', 'heading', 'body', 'date'], where: {
                startYear: req.params.startYear, endYear: req.params.endYear,
                destinationSchoolId: req.account.school.id
            }, include: {association: 'attachments', attributes: ['path']}
        })

        res.send(announcements)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


// get announcements sent by a school
// /alhbd/2020-2021/announcements/sent
router.get('/:siteName/:startYear-:endYear/announcements/sent', auth(['School']), async (req, res) => {
    try {
        const announcements = await Announcement.findAll({
            attributes: ['destinationTeacherInYearId', 'destinationStudentInClassId', 'destinationSchoolClassId', 'destinationClassroomId'],
            where: {
                startYear: req.params.startYear, endYear: req.params.endYear, sourceSchoolId: req.account.school.id
            },
            include: {association: 'attachments', attributes: ['path']}
        })

        res.send(announcements)
    } catch (e) {
        console.log(e)
        res.status(400).send(e.message)
    }
})


module.exports = router