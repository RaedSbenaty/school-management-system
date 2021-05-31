var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

class Account extends Model {
    static async findByCredentials(email, password) {
        var account = await Account.findOne({
            include: ['school',
                {association: 'teacher', include: 'personalInfo'},
                {association: 'student', include: 'personalInfo'},
            ]
        }, {where: {email}})

        if (!account) throw new Error('Cannot find account.')

        var isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) throw new Error('Wrong password.')

        return account
    }

    async generateAuthToken() {
        var payload = {id: this.id, email: this.email, user: this.user, siteName: this.siteName}
        console.log(payload)
        return jwt.sign(payload, process.env.JWT_SECRET)
    }
}

Account.init({
    email: {
        type: DataTypes.STRING, allowNull: false, unique: true,
        validate: {isEmail: true}
    },
    password: {
        type: DataTypes.STRING, allowNull: false,
        validate: {min: 8}
    },
    user: {type: DataTypes.STRING, allowNull: false},
    phoneNumber: {type: DataTypes.STRING, allowNull: false},
    image: {type: DataTypes.BLOB},
    siteName:{type: DataTypes.STRING}
}, {sequelize, modelName: 'account', timestamps: false})

Account.beforeSave(async (account) => {
        if (account.changed('password', true))
            account.password = await bcrypt.hash(account.password, 8)
    }
)

module.exports = Account
