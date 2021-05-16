var express = require('express')
var {Op} = require('sequelize')
var router = express.Router()
var School = require('../models/school')
var Account = require('../models/account')
var schoolClass = require('../models/schoolClass')
var auth = require('../middlewares/auth')

//example
/*
{
        "schoolName": "Raghad",
        "location": "midan",
        "foundationDate": "08-05-2021",
        "facebookPage": "https://www.facebook.com/AlHudoodNet/",
        "siteName": "alhbd",
        "account": {
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
        var school = await School.create(req.body, {include: [Account]})
        school.dataValues.token = school.account.generateAuthToken()
        res.status(201).send(school)
    } catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed.')
    }
})

// alhbd/classes?start=2020&end=2021
router.get('/:schoolName/classes', auth, async (req, res) => {
    var {start, end} = req.query
    try {
        var school = await School.findOne({
            include: {
                association: 'schoolClasses', include: 'class',
                where: {startYear: {[Op.gte]: start || 0}, endYear: {[Op.lte]: end || 99999}}
            },
            where: {siteName: req.params.schoolName}
        })
        res.send(school.schoolClasses)
    } catch (e) {
        console.log(e)
        res.status(404).send('Unable to get classes for this school.')
    }
})

/*
start <= end
alhbd/classes/add
{
   startYear: 2020,
   endYear: 2021,
   classes: [1,3,5]
}
 */

router.post('/:schoolName/classes/add', auth, async (req, res) => {
    try {
        var school = await School.findOne({
            include: [schoolClass],
            where: {siteName: req.params.schoolName},
        })

        for (let classId of req.body.classes) {
            var {startYear, endYear} = req.body
            await school.createSchoolClass({classId, startYear, endYear})
        }

        res.send(`Classes with id: ${req.body.classes.toString()} were added.`)
    } catch (e) {
        console.log(e)
        res.status(200).send('Unable to add classes for this school.')
    }
})

module.exports = router