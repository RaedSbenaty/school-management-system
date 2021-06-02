//modules
const {DataTypes, Model} = require('sequelize')
const sequelize = require('../db/sequelize')
var Account = require('./account')

class School extends Model {

    static async findByCriteriaInPeriod(schoolId, startYear, endYear) {
        return await School.findOne({
            where: {id: schoolId},
            include: {association: 'schoolClasses', where: {startYear, endYear}, include: 'class'}
        }) || {schoolClasses: []}
    }

    async createSchoolClasses(startYear, endYear, classes) {
        var oldClasses = classes.filter(newClass =>
            this.schoolClasses.find(schoolClass => schoolClass.classId === newClass))

        if (oldClasses.length)
            throw new Error(`Classes with id: ${oldClasses} are already existing.`)

        for (let classId of classes)
            await this.createSchoolClass({classId, startYear, endYear})
    }
}

//School properties
School.init({
    schoolName: {
        type: DataTypes.STRING,
        allowNull: false,unique: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foundationDate: {
        type: DataTypes.DATE,
    },
    facebookPage: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true,
            is: /^(http|https):\/\/www.facebook.com\/.*/i
        }
    },
}, {sequelize, modelName: 'school', timestamps: false})

//School relations
School.belongsTo(Account, {foreignKey: {allowNull: false}})
Account.hasOne(School)

//School.hasMany(Content)

module.exports = School