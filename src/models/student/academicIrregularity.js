//modules
const sequelize = require('../../db/sequelize')
const {DataTypes, Model} = require('sequelize')

class AcademicIrregularity extends Model {
}

//AcademicIrregularity properties
AcademicIrregularity.init({
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
    },
    date: {
        type: DataTypes.DATE
    }
}, {sequelize, timestamps: false})

//AcademicIrregularity Relations


module.exports = AcademicIrregularity