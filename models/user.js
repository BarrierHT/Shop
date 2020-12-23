const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user',{

	id:{
        type: Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
	},
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        defaultValue:'Email Not sent'
    }
	
});

module.exports = User;
