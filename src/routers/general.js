var express = require('express')
var router = express.Router()
var Class = require('../models/class')
const Account = require('../models/account')
const auth = require('../middlewares/auth')


router.post('/login',async (req, res) => {
    try {
        var account = await Account.findByCredentials(req.body.email, req.body.password)
        account.dataValues.token = account.generateAuthToken()
        res.status(201).send(account)
    } catch (e) {
        console.log(e)
        res.status(400).send('Unable to log in.')
    }
})

router.get('/classes', async (req, res) => {
    try {
        var classes = await Class.findAll()
        await res.send(classes)
    } catch (e) {
        res.status(500).send('Failed to fetch classes')
    }
})

module.exports = router
