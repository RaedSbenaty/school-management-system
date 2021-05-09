const express = require('express')
const router = express.Router()
const School = require('../models/school')
const auth = require('../middleware/auth')

//example
/*{
    "schoolInfo": {
        "schoolName": "Raghad",
        "location": "midan",
        "foundationDate": "08-05-2021",                            //optional
        "facebookPage": "https://www.facebook.com/AlHudoodNet/",   //optional
    },   
    "accountInfo": {
        "email": "dodeh@hbd.com",
        "password": "100009078",
        "phoneNumber": "+963944656499",
        "personalImage": ""                                        //optional
    } 
}
*/

//sign up
router.post('/signup/schools', async (req, res) => {
    try {
        var school = await School.create(req.body.school)
        req.body.account.user = "school"
        var account = await school.createAccount(req.body.account)

        res.status(201).send({ school, account, token: account.generateAuthToken() })
    }
    catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed')
    }
})

module.exports = router