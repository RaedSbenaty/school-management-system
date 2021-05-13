var {Sequelize} = require('sequelize')

var sequelize = new Sequelize(process.env.DATABASE,process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mssql',
    logging: false
});

module.exports = sequelize
