const jwt = require('jsonwebtoken')
const Account = require('../models/account')

module.exports = (userTypes) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '')
            const payload = jwt.verify(token, process.env.JWT_SECRET)

            const account = await Account.findByPk(payload.id, {
                include: [
                    {association: 'school'},
                    {association: 'teacher', include: 'personalInfo'},
                    {association: 'student', include: ['personalInfo','inLocoParentis']},
                ]
            })
            if (!account || account.email !== payload.email) throw new Error('Account not found.')
            if (userTypes && !userTypes.includes(account.user)) throw new Error('Invalid account type.')
            if (account.school && account.siteName !== req.params.siteName) throw new Error('Unauthorized site name.')
            if (payload.teacherId && req.params.teacherId && payload.teacherId != req.params.teacherId)
                throw new Error('Unauthorized teacher id.')
            if (payload.studentId && req.params.studentId && payload.studentId != req.params.studentId)
                throw new Error('Unauthorized student id.')

            req.account = account
            next()
        } catch (e) {
            console.log(e)
            res.status(401).send('Authorization failed.')
        }
    }
}
