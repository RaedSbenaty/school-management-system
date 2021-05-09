var jwt = require('jsonwebtoken')
var Account = require('../models/account')

module.exports = async (req, res, next) => {
    try {
        var token = req.header('Authorization').replace('Bearer ', '')
        var payload = jwt.verify(token, process.env.JWT_SECRET)
        console.log(payload)
        var account = Account.findByPk(payload.id)
        if (!account || account.email !== payload.email) throw new Error()

        req.account = account
        next()
    } catch (e) {
        res.status(401).send('Authorization failed.')
    }
}
