var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

class Account extends Model {
    static async findByCredentials(email, password) {
        var account = await Account.findOne({where: {email}})
        if (!account) throw new Error('Unable to log in.')

        var isMatch = await bcrypt.compare(password, account.password)
        if (!isMatch) throw new Error('Unable to log in.')

        var user = {account}
        if(account.user==='School') user.data = await account.getSchool()

        else {
            if(account.user==='Teacher') user.data = await account.getTeacher()
            else  user.data =await account.getStudent()

            user.personal_info = await user.data.getPersonal_Info()
        }
        return user
    }

    generateAuthToken() {
       return  jwt.sign({id: this.id, email: this.email, user:this.user}, process.env.JWT_SECRET)
    }

    toJSON() {
        var {email, phoneNumber, personalImage} = this
        return {email, phoneNumber, personalImage}
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
    user: {
        // type: DataTypes.ENUM('School','Teacher','Student'),
        type: DataTypes.STRING,
        allowNull: false
    },
    phoneNumber: {
        type: DataTypes.STRING, allowNull: false,
        unique: true
    },
    Image: {type: DataTypes.STRING.BINARY}
}, {sequelize, timestamps: false})

Account.beforeSave(async (account) => {
        if (account.changed('password', true))
            account.password = await bcrypt.hash(account.password, 8)
    }
)

module.exports = Account
