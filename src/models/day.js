const {DataTypes, Model} = require('sequelize')
const sequelize = require('../db/sequelize')

class Day extends Model {
}

Day.init({
    name: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'day', timestamps: false})

Day.defaultDays = [
    {name: "Saturday"}, {name: "Sunday"}, {name: "Monday"}, {name: "Tuesday"},
    {name: "Wednesday"}, {name: "Thursday"}, {name: "Friday"}
]

module.exports = Day