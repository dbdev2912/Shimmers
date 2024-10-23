const { Sequelize } = require('sequelize');
require('dotenv').config();
const isTestingENV = process.env.TEST;

const testDatabase    = "db.test.sqlite";
const productDatabase = 'db.sqlite';
const database = (isTestingENV && isTestingENV == "true") ? testDatabase: productDatabase; 

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: database,
    logging: false
  });

module.exports = sequelize