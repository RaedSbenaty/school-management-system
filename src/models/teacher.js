var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')

class Teacher extends Model {

}

Teacher.init({
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },lastName: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {sequelize})

module.exports = Teacher
