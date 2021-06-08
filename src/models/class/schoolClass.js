const { DataTypes, Model } = require('sequelize')
const sequelize = require('../../db/sequelize')
const School = require('../school')
const Class = require('./class')

class SchoolClass extends Model {

    static async findByCriteria(schoolId, startYear, endYear, className) {
        className = className.replace('_', ' ')
        return await SchoolClass.findOne({
            where: { schoolId, startYear, endYear },
            include: ['classrooms', 'subjectInYears', { association: 'class', where: { name: className } }],
        }) || { classrooms: [] }

    }

    async createClassrooms(classrooms) {
        //MIND BLOWING :O
        const oldClassrooms = classrooms.filter(newClassroom => this.classrooms.find(
            classroom => classroom.classroomNumber === newClassroom.classroomNumber))
            .map(classroom => classroom.classroomNumber)

        if (oldClassrooms.length)
            throw new Error(oldClassrooms)

        for (let classroom of classrooms)
            await this.createClassroom(classroom)
    }

    async checkSubjectsExist(subjects) {

        var mySubjects = []
        this.subjectInYears.forEach(subject=>{
            console.log('subjectInYear: ', subject);
            mySubjects.push(subject.name)})
                
        subjects.forEach(subject => {
            mySubjects.push(subject.name)
        });

        var existSubjects = mySubjects.filter((subject, index, arr) => arr.indexOf(subject) !== index)


        if (existSubjects.length)
            throw new Error(existSubjects)
    }
}

SchoolClass.init({
    startYear: { type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueSchoolClass' },
    endYear: {
        type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueSchoolClass',
        validate: {
            isValidPeriod(year) {
                if (year < this.startYear)
                    throw new Error('Start year must be before end year.')
            }
        }
    }
}, { sequelize, modelName: 'schoolClass', timestamps: false })


SchoolClass.belongsTo(Class, { foreignKey: { allowNull: false, unique: 'uniqueSchoolClass' } })
Class.hasMany(SchoolClass)

SchoolClass.belongsTo(School, { foreignKey: { allowNull: false, unique: 'uniqueSchoolClass' } })
School.hasMany(SchoolClass)


module.exports = SchoolClass