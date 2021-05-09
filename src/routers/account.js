const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Account = require('../models/account')

//example
/*{
   "email": "abd@hbd.com",
   "password": "12345678" 
}
*/

//login
router.post('/login', async (req, res) => {
    try {
        const account = await Account.findByCredentials(req.body.email, req.body.password)

        res.status(201).send({ account, token: account.generateAuthToken() })
    }
    catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router