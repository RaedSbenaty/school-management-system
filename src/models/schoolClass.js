var {DataTypes, Model} = require('sequelize')
var sequelize = require('../db/sequelize')
var School = require('./school')
var Class = require('./class')

class SchoolClass extends Model {
    static async findByCriteria(schoolId, startYear, endYear, className) {
        className = className.replace('_', ' ')
        return await SchoolClass.findOne({
            where: {schoolId, startYear, endYear},
            include: ['classrooms', {association: 'class', where: {name: className}}],
        }) || {classrooms: []}
    }

    async createClassrooms(classrooms) {
        //MIND BLOWING :O
        var oldClassrooms = classrooms.filter(newClassroom => this.classrooms.find(
            classroom => classroom.classroomNumber === newClassroom.classroomNumber))
            .map(classroom => classroom.classroomNumber)

        if (oldClassrooms.length)
            throw new Error(`Classrooms with number: ${oldClassrooms} are already existing.`)

        for (let classroom of classrooms)
            await this.createClassroom(classroom)
    }
}

SchoolClass.init({
    startYear: {type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueSchoolClass'},
    endYear: {
        type: DataTypes.INTEGER, allowNull: false, unique: 'uniqueSchoolClass',
        validate: {
            isValidYears(year) {
                if (year < this.startYear)
                    throw new Error('Start year must be before end year.')
            }
        }
    }
}, {sequelize, modelName: 'schoolClass', timestamps: false})


SchoolClass.belongsTo(Class, {foreignKey: {allowNull: false, unique: 'uniqueSchoolClass'}})
Class.hasMany(SchoolClass)

SchoolClass.belongsTo(School, {foreignKey: {allowNull: false}})
School.hasMany(SchoolClass)


module.exports = SchoolClass