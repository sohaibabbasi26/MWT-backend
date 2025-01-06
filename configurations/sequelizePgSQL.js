const dotenv = require("dotenv");
const { Sequelize } = require('sequelize');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME || 'MWT_database', process.env.DB_USER || 'user', process.env.DB_PASS || 'password', {
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: console.log,  
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = {sequelize};
