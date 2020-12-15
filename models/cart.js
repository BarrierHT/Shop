const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const Product = require('./product');

const pathFileProducts = path.join(rootDir,'data','products.json');
const pathFileCart = path.join(rootDir,'data','cart.json');

module.exports = class Cart{

    static updateTotalPrice(totalPrice,cb){
        fs.readFile(pathFileCart,(err,fileContent) => {
            let cart = {product:[],totalPrice:0};
            if(!err){
                cart = JSON.parse(fileContent);
                cart.totalPrice = totalPrice;  
            } 
            fs.writeFile(pathFileCart,JSON.stringify(cart),err => {
                console.log('error: ',err);
                cb();
            });
        });
    }

    static getCart(cb){
        fs.readFile(pathFileCart,(err,fileContent) => {
            if(!err) cb(JSON.parse(fileContent));
            else cb({products:[],totalPrice:0});
        });
    }

    static addProduct(id,priceProduct){
    
        fs.readFile(pathFileCart,(err,fileContent) => {
            //create or get a created cart
            let cart = {products:[],totalPrice:0};
            if(!err) cart = JSON.parse(fileContent);
            //Check if a product exist already
            let existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            let existingProduct = cart.products[existingProductIndex];
            let updatedProduct;

            if(existingProductIndex != -1){                                         //Add the quantity in 1
                updatedProduct = existingProduct; 
                updatedProduct.qty++;
                cart.products[existingProductIndex] = updatedProduct;
            }
            else{                                                                   //Create a new product
                updatedProduct = {id:id, qty:1};
                cart.products = [...cart.products,updatedProduct];
            }
            cart.totalPrice+= Number(priceProduct);

            fs.writeFile(pathFileCart,JSON.stringify(cart), err =>{
                console.log('err: ', err);
            });

        });
    }

    static deleteProductById(id,productPrice, permanentDeleting, cb) {
        fs.readFile(pathFileCart,(err,fileContent) => {
						
            let cart = {products: [],totalPrice: 0};
            if(!err) cart = JSON.parse(fileContent);

            let cartProductIndex = cart.products.findIndex(p => p.id === id );
            let cartProduct = cart.products[cartProductIndex];
            let cartProductQty = 0;

            if(cartProduct){
                cartProductQty = cartProduct.qty;
                if(permanentDeleting || cartProductQty == 1)  cart.products.splice(cartProductIndex,1);
                else cart.products[cartProductIndex].qty = cartProductQty - 1;
            }
            
            cart.totalPrice -= (permanentDeleting? (cartProductQty*productPrice) : productPrice);
            console.log('Cart: ',cart); 
            
            fs.writeFile(pathFileCart,JSON.stringify(cart), err => { 
                console.log('error: ',err);
                cb();
            });
        });
    }
}