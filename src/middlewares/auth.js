var jwt = require('jsonwebtoken')
var Account = require('../models/account')

module.exports = async (req, res, next) => {
    try {
        var token = req.header('Authorization').replace('Bearer ', '')
        var payload = jwt.verify(token, process.env.JWT_SECRET)

        var account = await Account.findByPk(payload.id, {
            include: [
                {association: 'school'},
                {association: 'teacher', include: 'personalInfo'},
                {association: 'student', include: 'personalInfo'},
            ]
        })

        if (!account || account.email !== payload.email) throw new Error('Account not found.')
        req.account = account
        next()
    } catch (e) {
        console.log(e)
        res.status(401).send('Authorization failed.')
    }
}
