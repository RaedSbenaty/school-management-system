const {Sequelize} = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mssql',
    omitNull: true,
    logging: false
});

module.exports = sequelize
