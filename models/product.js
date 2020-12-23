
const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product',{

	id: {
		type: Sequelize.INTEGER,
		primaryKey:true,
		autoIncrement:true,
		allowNull: false
	},
	title: {
		type: Sequelize.STRING,
		allowNull:false
	},
	price: {
		type: Sequelize.DOUBLE(12,2),
		allowNull:false
	},
	imageUrl: {
		type: Sequelize.TEXT,
		allowNull:false
	},
	description: Sequelize.TEXT
	
});


module.exports = Product;
