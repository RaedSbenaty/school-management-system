var { DataTypes, Model } = require('sequelize')
var sequelize = require('../db/sequelize')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

class Account extends Model {
    static async findByCredentials(email, password) {

        const account = await Account.findOne({ where: { email } })

        if (!account)
            throw new Error('Unable to log in')

        const isMatch = await bcrypt.compare(password, account.password)

        if (!isMatch)
            throw new Error('Unable to log in')

            console.log(account.user);
        if (account.user === 'teacher')
            account.teacher = await account.getTeacher()

        else if (account.user === 'student')
            account.student = await account.getStudent()

        else if (account.user === 'school')
            account.school = await account.getSchool()

        return account
    }


    generateAuthToken() {
        return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET)
    }

    toJSON() {
        var { email, phoneNumber, personalImage } = this
        return { email, phoneNumber, personalImage }
    }
}

Account.init({
    email: {
        type: DataTypes.STRING, allowNull: false, unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING, allowNull: false,
        validate: { min: 8 }
    },
    user: {
        type: DataTypes.STRING
    },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    personalImage: { type: DataTypes.STRING.BINARY }

}, { sequelize })

Account.beforeSave(async (account) => {
    if (account.changed('password', true))
        account.password = await bcrypt.hash(account.password, 8)
})

module.exports = Account
