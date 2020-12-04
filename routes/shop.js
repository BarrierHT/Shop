const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

router = express.Router();

router.get('/',(req,res,next) => {                                           
    console.log(req.originalUrl);
    // console.log( __filename.split(/[\\/]/).pop() );
    // console.log( path.join(__dirname,'../','views','shop.html') );
    // console.log(rootDir);
    res.sendFile( path.join(rootDir,'views','shop.html') ); 
});

module.exports = {
    router: router
};