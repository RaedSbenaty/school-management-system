const {DataTypes, Model} = require('sequelize')
const sequelize = require('../db/sequelize')
const School = require('../school')

class Content extends Model {
}

Content.init({
    type: { type: DataTypes.STRING, allowNull: false },
    header: { type: DataTypes.STRING},
    body: { type: DataTypes.STRING},

}, {sequelize, modelName: 'content', timestamps: false})

Content.belongsTo(School)
School.hasMany(Content)

module.exports = Content