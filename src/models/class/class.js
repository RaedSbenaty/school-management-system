const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

class Class extends Model {
}

Class.init({
    name: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'class', timestamps: false})

Class.defaultClasses = [
    {name: "Preschool"}, {name: "KG1"}, {name: "KG2"}, {name: "First Grade"},
    {name: "Second Grade"}, {name: "Third Grade"}, {name: "Fourth Grade"}, {name: "Fifth Grade"},
    {name: "Sixth Grade"}, {name: "Seventh Grade"}, {name: "Eighth Grade"}, {name: "Tenth Grade"},
    {name: "Eleventh Grade"}, {name: "Twelfth Grade"}
]

module.exports = Class