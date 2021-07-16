//modules
const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')
const Account = require('../account')

class School extends Model {

    static async findByCriteriaInPeriod(schoolId, startYear, endYear) {
        return await School.findOne({
            where: {id: schoolId},
            include: {association: 'schoolClasses', where: {startYear, endYear}, include: 'class'}
        }) || {schoolClasses: []}
    }

    async createSchoolClasses(startYear, endYear, classes) {
        const oldClasses = classes.filter(newClass =>
            this.schoolClasses.find(schoolClass => schoolClass.classId === newClass
                && schoolClass.startYear == startYear && schoolClass.endYear == endYear))

        if (oldClasses.length)
            throw new Error(oldClasses)

        for (let classId of classes)
            await this.createSchoolClass({classId, startYear, endYear})
    }
}

//School properties
School.init({
    schoolName: {
        type: DataTypes.STRING,
        allowNull: false
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