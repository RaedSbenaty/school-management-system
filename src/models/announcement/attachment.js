const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const Announcement = require('./announcement')

class Attachment extends Model {
}

Attachment.init({
    path: {type: DataTypes.STRING, allowNull: false},
}, {sequelize, modelName: 'attachment', timestamps: false})


Attachment.belongsTo(Announcement, {foreignKey: {allowNull: false}})
Announcement.hasMany(Attachment)

module.exports = Attachment
