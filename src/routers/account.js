const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Account = require('../models/account')

//example
/*
{
   "email": "abd@hbd.com",
   "password": "12345678" 
}
*/

//login
router.post('/login', async (req, res) => {
    try {
        var response = await Account.findByCredentials(req.body.email, req.body.password)
        response.token = response.account.generateAuthToken()
        res.status(200).send(response)
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router