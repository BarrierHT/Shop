const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');


router = express.Router();

router.get('/',(req,res,next) => {                                           
    console.log(req.originalUrl);

    const products = adminData.products;
    console.log('products: ',adminData.products);

    // console.log( __filename.split(/[\\/]/).pop() );
    // console.log( path.join(__dirname,'../','views','shop.html') );
    
    res.render('shop.ejs',{
        prods: products, docTitle: 'My MainShop',
        path: req._parsedOriginalUrl.pathname
    }); 
});





module.exports = {
    router: router
};