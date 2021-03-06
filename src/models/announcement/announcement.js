const {DataTypes, Model} = require('sequelize')
const sequelize = require('../../db/sequelize')

const AnnouncementType = require('./announcementType')
const School = require('../school/school')
const SchoolClass = require('../class/schoolClass')
const Classroom = require('../class/classroom')
const TeacherInYear = require('../teacher/teacherInYear')
const StudentInClass = require('../student/studentInClass')

class Announcement extends Model {
}

Announcement.init({
    heading: {type: DataTypes.STRING, allowNull: false},
    body: {type: DataTypes.TEXT, allowNull: false},
    date: {type: DataTypes.DATE, allowNull: false},
    startYear: {type: DataTypes.INTEGER, allowNull: false},
    endYear: {
        type: DataTypes.INTEGER, allowNull: false,
        validate: {
            isValidPeriod(year) {
                if (year < this.startYear)
                    throw new Error('Start year must be before end year.')
            }
        }
    },
    sourceSchoolId: {type: DataTypes.INTEGER, references: {model: School, key: 'id'}},
    sourceTeacherInYearId: {type: DataTypes.INTEGER, references: {model: TeacherInYear, key: 'id'}},
    sourceStudentInClassId: {type: DataTypes.INTEGER, references: {model: StudentInClass, key: 'id'}},

    destinationSchoolId: {type: DataTypes.INTEGER, references: {model: School, key: 'id'}},
    destinationTeacherInYearId: {type: DataTypes.INTEGER, references: {model: TeacherInYear, key: 'id'}},
    destinationStudentInClassId: {type: DataTypes.INTEGER, references: {model: StudentInClass, key: 'id'}},
    destinationSchoolClassId: {type: DataTypes.INTEGER, references: {model: SchoolClass, key: 'id'}},
    destinationClassroomId: {type: DataTypes.INTEGER, references: {model: Classroom, key: 'id'}}
}, {sequelize, modelName: 'announcement', timestamps: false})


Announcement.belongsTo(AnnouncementType, {foreignKey: {allowNull: false}})
AnnouncementType.hasMany(Announcement)


Announcement.beforeSave((announcement) => {
    let senders = 0, receivers = 0

    const sourceList = [announcement.sourceSchoolId, announcement.sourceTeacherInYearId, announcement.sourceStudentInClassId]
    const destList = [announcement.destinationSchoolId, announcement.destinationTeacherInYearId
        , announcement.destinationStudentInClassId, announcement.destinationSchoolClassId, announcement.destinationClassroomId]

    sourceList.forEach(source => source ? senders++ : senders)
    destList.forEach(dest => dest ? receivers++ : receivers)

    if (senders !== 1 || receivers !== 1)
        throw new Error('Just one sender and one receiver is allowed.')
})

module.exports = Announcement
