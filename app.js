const path = require('path');
// const http = require('http');

// const nodemon = require('nodemon');
// const pug = require('pug');
// const ejs = require('ejs');
const expressHbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');

const adminData = require('./routes/admin');
const shopData = require('./routes/shop');
const rootDir = require('./util/path');


const app = express();                                                  //Get main express function

app.locals.user = 'BarrierHT';

// app.engine('hbs',expressHbs({
//             layoutsDir: 'views/layouts/',
//             defaultLayout:'main-layout', 
//             extname:'hbs'
// }));

app.set('view engine','ejs');
app.set('views','views/');                   


app.use( bodyParser.urlencoded( {extended:false} ) );
app.use( express.static( path.join(rootDir,'public') ) );

app.use('/', (req,res,next) => {                                           
    console.log('This is always running');
    console.log('url:' , req.originalUrl);
    next();                                                             
});

app.use('/admin',adminData.router);                                            //Product and addProduct Routes


app.use(shopData.router);                                             //Main shop Routes


app.use( (req,res,next) =>{
    console.log('Page not found, 404 error');
    res.status(404).render('404.ejs',{
        docTitle:'404 Page Not Found',
        path: req._parsedOriginalUrl.pathname
    });
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'),'127.0.0.1');

