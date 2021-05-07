var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var jwt = require('jsonwebtoken')
var bcrypt = require('bcrypt')

class Account extends Model {
    generateAuthToken() {
        return jwt.sign({id: this.id, email: this.email}, process.env.JWT_SECRET)
    }

    toJSON() {
        var {email,phoneNumber} = this
        return {email,phoneNumber}
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
    phoneNumber: {type: DataTypes.STRING, allowNull: false, unique: true}
}, {sequelize})

Account.beforeSave(async (account) =>{
    if(account.changed('password',true))
        account.password = await bcrypt.hash(account.password, 8)
})

module.exports = Account
