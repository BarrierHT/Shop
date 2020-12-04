const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

router = express.Router();

router.post('/addProduct',(req,res,next) => {                                           
    console.log(req.originalUrl);
    console.log('hi');
    console.log({...req.body});

    res.redirect(301,'/');
});

router.get('/addProduct',(req,res,next) => {                                           
    console.log(req.originalUrl);

    res.sendFile( path.join(rootDir,'views','addProduct.html')  );                      //Sending a response (last Middleware) with auto Content-Type
});


router.get('/',(req,res,next) => {                                        
    console.log(req.baseUrl);
    res.send('<h1> You are in admin page </h1> ');                      //Sending a response (last Middleware) with auto Content-Type
});

module.exports = {
    router: router
};