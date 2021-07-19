const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const Announcement = require('./announcement')

class Attachment extends Model {
    static async handleCreateAnnouncementRequest(req, res, source) {
        try {
            const announcement = await Announcement.create({
                ...source, ...JSON.parse(req.body.json)
                , startYear: req.params.startYear, endYear: req.params.endYear
            })
            req.files.forEach(file => Attachment.create({
                announcementId: announcement.id, path: 'uploads/' + file.filename
            }))

            res.status(201).send('Announcement posting is done.')
        } catch (e) {
            console.log(e)
            res.status(500).send(e.message)
        }
    }
}

Attachment.init({
    path: {type: DataTypes.STRING, allowNull: false},
}, {sequelize, modelName: 'attachment', timestamps: false})


Attachment.belongsTo(Announcement, {foreignKey: {allowNull: false}})
Announcement.hasMany(Attachment)

module.exports = Attachment
