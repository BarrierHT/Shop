const mysql = require('mysql2');

let data = {
    host:'localhost',
    database: 'node-complete',
    user: 'root',
    password: 'administrator' 
};

const pool = mysql.createPool(data);

const Sequelize = require('sequelize');
// console.log(Sequelize);
const sequelize = new Sequelize('node-complete','root','administrator',{});

module.exports = pool.promise();



