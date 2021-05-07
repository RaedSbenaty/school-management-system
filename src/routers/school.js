var express = require('express')
var router = express.Router()
var School = require('../models/school')
var auth = require('../middleware/auth')
/*{
    "schoolInfo": {
        "schoolName": "Raghad",
        "location": "midan"
    },   
    "accountInfo": {
        "email": "dodeh@hbd.com",
        "password": "100009078",
        "phoneNumber": "+963944656499"
    } 
}
*/

//sign up
router.post('/signup/schools', async (req, res) => {
    try {
        var school = await School.create(req.body.schoolInfo)
        var account = await school.createAccount(req.body.accountInfo)

        res.status(201).send({school, account, token: account.generateAuthToken() })
    }
    catch (e) {
        console.log(e)
        res.status(400).send('Sign up failed')
    }
})

module.exports = router