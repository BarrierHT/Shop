const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const Cart = require('./cart');
const db = require('../util/database');

module.exports = class Product{
	
    constructor(id,title,price,description,imageUrl){
		this.id = id;	
		this.title = title;
		this.price = price;
		this.imageUrl = imageUrl;
		this.description = description;
	}
	
    save(){		
		return db.execute('INSERT INTO products (title,description,price,imageUrl) VALUES(?,?,?,?)',
			[this.title, this.description, this.price, this.imageUrl]
		);
	}

    static fetchAll(){
		return db.execute('SELECT * FROM products');
	}

	static findById(id){
		return db.execute('SELECT * FROM products WHERE id=?',
		[id]);
	}
	
	static deleteById(id){
		
	}
}




 