const path = require('path');
// const http = require('http');

const nodemon = require('nodemon');
const express = require('express');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');


const app = express();                                                  //Get main express function
app.use( bodyParser.urlencoded( {extended:false} ) );
app.use( express.static( path.join(rootDir,'public') ) );

app.use('/', (req,res,next) => {                                           
    console.log('This is always running');
    console.log('url:' , req.originalUrl);
    next();                                                             
});

app.use('/admin',adminRoutes.router);                                            //Product and addProduct Routes

app.use(shopRoutes.router);                                             //Main shop Routes


app.use( (req,res,next) =>{
    console.log('Page not found, 404 error');
    res.status(404).sendFile( path.join(rootDir,'views','404.html') );
});

app.listen(3000,'127.0.0.1');

