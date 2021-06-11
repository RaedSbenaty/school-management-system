const {DataTypes, Model} = require('sequelize')
const sequelize = require('../db/sequelize')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

class Account extends Model {
    static async findByCriteria(email, password) {
        const account = await Account.findOne({
            include: ['school',
                {association: 'teacher', include: 'personalInfo'},
                {association: 'student', include: 'personalInfo'},
            ], where: {email}
        })

        if (!account) throw new Error('Cannot find account.')

        const isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) throw new Error('Wrong password.')

        return account
    }

    static async findByIdAndEmail(id, email) {
        return await Account.findOne({
            attributes: ['email'],
            include: ['school',
                {association: 'teacher', include: {association: 'personalInfo', attributes: ['firstName', 'lastName']}},
                {association: 'student', include: {association: 'personalInfo', attributes: ['firstName', 'lastName']}},
            ], where: {email, id}
        })
    }

    generateAuthToken() {
        const payload = {id: this.id, email: this.email, user: this.user, siteName: this.siteName}
        return jwt.sign(payload, process.env.JWT_SECRET)
    }
}

Account.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING, allowNull: false,
        validate: {isEmail: true}
    },
    password: {
        type: DataTypes.STRING, allowNull: false,
        validate: {min: 8}
    },
    user: {type: DataTypes.ENUM('School', 'Teacher', 'Student'), allowNull: false},
    phoneNumber: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.BLOB},
    siteName: {
        type: DataTypes.STRING,
        validate: {is: /^[a-zA-Z0-9_-]+$/}
    }
}, {sequelize, modelName: 'account', timestamps: false})

Account.beforeSave(async (account) => {
        let errorMessage = ''

        if (await Account.findOne({where: {email: account.email}}))
            errorMessage += 'Validation error: email must be unique.\n'

        if (!account.siteName && account.user === 'School')
            errorMessage += 'Validation error: School must has a site name.\n'

        if (account.siteName && await Account.findOne({where: {siteName: account.siteName}}))
            errorMessage += 'Validation error: site name must be unique.\n'

        if (errorMessage !== '') throw new Error(errorMessage)

        if (account.changed('password', true))
            account.password = await bcrypt.hash(account.password, 8)
    }
)


module.exports = Account
