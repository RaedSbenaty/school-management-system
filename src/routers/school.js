const express = require('express')
const router = express.Router()
const School = require('../models/school')
var Account = require('../models/account')
const auth = require('../middlewares/auth')

//example
/*{
    "schoolInfo": {
        "schoolName": "Raghad",
        "location": "midan",
        "foundationDate": "08-05-2021",                            //optional
        "facebookPage": "https://www.facebook.com/AlHudoodNet/"    //optional
    },   
    "account": {
        "email": "dodeh@hbd.com",
        "password": "100009078",
        "phoneNumber": "+963944656499"
    }
}
*/

//sign up
router.post('/signup/schools', async (req, res) => {
    try {
        req.body.account.user = 'School'
        var account = await Account.create(req.body.account)

        var school = await School.create(req.body.schoolInfo)
        await school.setAccount(account)

        res.status(201).send({ school, account, token: account.generateAuthToken() })
    } catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed.')
    }
})

module.exports = router