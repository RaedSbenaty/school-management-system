var {Sequelize} = require('sequelize')

var sequelize = new Sequelize(process.env.DATABASE,process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mssql'
});

module.exports = sequelize
