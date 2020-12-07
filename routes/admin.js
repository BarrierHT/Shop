const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

router = express.Router();


const products = [];

router.post('/addProduct',(req,res,next) => {                                           
    console.log(req.originalUrl);
    // console.log(req.app.locals);
    console.log({...req.body});

    products.push({title:req.body['title']});
    res.redirect(301,'/');
});

router.get('/addProduct',(req,res,next) => {                                           
    console.log(req.originalUrl);
    // console.log(req);
    res.render('addProduct.ejs',{
        docTitle:'Add Products', 
        path: req._parsedOriginalUrl.pathname
    });                      //Sending a response (last Middleware) with auto Content-Type
});


router.get('/',(req,res,next) => {                                        
    console.log(req.baseUrl);
    res.send('<h1> You are in admin page </h1> ');                      //Sending a response (last Middleware) with auto Content-Type
}); 


module.exports = {
    router: router,
    products: products
};