const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

class Category extends Model {
}

Category.init({
    name: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'category', timestamps: false})

Category.defaultCategories = [
    {name: "Physics"}, {name: "Math"}, {name: "Religion"}, {name: "Language"},
    {name: "Chemistry"}, {name: "Science"}, {name: "Philosophy"}, {name: "Entertainment"},
    {name: "Information Technology"}, {name: "Social Studies"}, {name: "Other"}
]

module.exports = Category