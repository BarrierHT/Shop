const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./util/path');
const infoData = require('./controllers/info');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const mongoConnect = require('./util/database');    

const app = express();                                                  //Get main express function

app.locals.user = 'BarrierHT';

app.set('view engine','ejs');
app.set('views','views/');                   


app.use( bodyParser.urlencoded( {extended:false} ) );
app.use( express.static( path.join(rootDir,'public') ) );

app.use( (req,res,next) =>{                                                     
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;                                                        //ToDo Create a req.user in the middleware
    //         next();
    //     })
    //     .catch(err => console.log(err));
    next();
});

app.use('/', infoData.firstMiddleware);

app.use('/admin',adminRoutes.router);                                               //Product and addProduct Routes
app.use(shopRoutes.router);                                                         //Main shop Routes


app.use(infoData.get404);


app.set('port', process.env.PORT || 3000);

mongoConnect.checkConnection(  () => app.listen(app.get('port')) );
