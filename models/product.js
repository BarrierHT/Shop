const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const Cart = require('./cart');

const pathFileProducts = path.join(rootDir,'data','products.json');
const pathFileCart = path.join(rootDir,'data','cart.json');

const getProductsFromFile = (cb) => {
		fs.readFile(pathFileProducts,(err,fileContent) =>{
			if(!err) cb(JSON.parse(fileContent));		
			else cb([]);
		});	
};

const writeProductsToFile = (cb,products) => { 
	fs.writeFile(pathFileProducts,JSON.stringify(products),err => {							//Write new object in the file
		console.log('error: ',err);
		cb();
	});	
}

module.exports = class Product{
	
    constructor(id,title,price,description,imageUrl){
		this.id = id;	
		this.title = title;
		this.price = price;
		this.imageUrl = imageUrl;
		this.description = description;
	}
	
    save(cb){		
		getProductsFromFile(products => {
			if(this.id){			
				const existingProductId = products.findIndex(prod => prod.id === this.id);
				const updatedProducts = [...products];
				updatedProducts[existingProductId] = this;
				writeProductsToFile(cb,updatedProducts);
			}
			else{
				const idMax = 1e9;
				this.id = (Math.random() * idMax).toString();
				products.push(this);
				writeProductsToFile(cb,products);
			}
		});
	}

    static fetchAll(cb){
		getProductsFromFile(products => {
			cb(products);
		});
	}

	static findById(id,cb){
		getProductsFromFile(products => {
			const product = products.find(p => p.id == id);
			cb(product);
		});
	}
	
	static deleteById(id,cb){
		getProductsFromFile(products => {

			const productPrice = products.find(p => p.id === id).price; 
			const updatedProducts = products.filter(p => p.id !== id);

			fs.writeFile(pathFileProducts,JSON.stringify(updatedProducts), err => {
				if(!err) Cart.deleteProductById(id,productPrice,true, () => cb());	
				else console.log('error: ',err);
			});
	
		});
	}
}




 