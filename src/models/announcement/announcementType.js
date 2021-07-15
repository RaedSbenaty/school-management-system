const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')


class AnnouncementType extends Model {
}

AnnouncementType.init({
    name: {type: DataTypes.STRING, allowNull: false}
}, {sequelize, modelName: 'announcementType', timestamps: false})

AnnouncementType.defaultAnnouncementTypes = [{name: 'Exam'}, {name: 'Sessions Scedual'}
    , {name: 'Additional Session'}, {name: 'Other'}]

module.exports = AnnouncementType