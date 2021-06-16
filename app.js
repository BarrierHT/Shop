const path = require('path');

const express = require('express');
require('dotenv').config();
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const infoData = require('./controllers/info');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const rootDir = require('./util/path');
const User = require('./models/user');                                  //Mongoose model

const app = express();                                                  //Get main express function

const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDatabase = process.env.MONGO_DATABASE;
const mongoDBUrl = `mongodb+srv://${mongoUser}:${mongoPassword}@node-course.msdnf.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`;

app.locals.user = 'BarrierHT';                                          //Local app Variables                                                

app.set('view engine','ejs');
app.set('views','views/');                   
app.set('port', process.env.PORT || 3000);

app.use(cookieParser());
app.use( bodyParser.urlencoded( {extended:false} ) );
app.use( express.static( path.join(rootDir,'public') ) );

app.use( session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoDBUrl,
        collectionName: 'sessions',
        touchAfter: 60,                                                  //Seconds
        // ttl: 60,                                                      //Seconds
        autoRemove: 'interval',
        autoRemoveInterval: 70                                           //Minutes
    })
    ,cookie: {maxAge: 60 * 60 * 1000 }
}));

app.use( csrf({cookie:false}) );                                         //Protect against csrf

app.use(flash());

app.use( (req,res,next) => {
    if(req.session.user){
        User.findById(req.session.user._id)
        .then(user => {
            if(user) req.user = user;                                    //Use Mongoose Methods
            next();
        })
        .catch(err => console.log('error: ', err));
    }
    else next();
});

app.use( (err, req, res, next) => {
    console.log('error(server): ' , err);
    if(err.code == 'EBADCSRFTOKEN'){                                         //Handle CSRF token errors here
        return res.status(403).send('Token not found');
    } 
    else next(err);
});

app.use( (req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.isVerified = req.session.isVerified;
    res.locals.csrfToken = req.csrfToken();                                             //*Use Token for every view (Local Response Variables)
    next();
});

app.use (  (req, res, next) => {                                                        //*Refresh cookie-session time
    if(req.session.user){
        try {
            let cookies = req.get('Cookie');
            cookies = cookies.split(';');
                cookies.forEach(cookie => {
                    if(cookie.trim().split('=')[0] == 'connect.sid'){
                        const valueCookie = cookie.split('=')[1];
                        res.setHeader('Set-Cookie',`connect.sid=${valueCookie}; Max-age=3600; Path=/`);
                        // console.log('valueCookie: ',valueCookie);
                    }
                });
        } catch (error) {
            console.log('error(session refresh): ',error);
        }
    }
    next();
});

app.use('/', infoData.firstMiddleware);

app.use('/admin',adminRoutes.router);                                               //Product and addProduct Routes
app.use(shopRoutes.router);                                                         //Main shop Routes
app.use(authRoutes.router);

app.use(infoData.get404);

mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then( result => {
        app.listen(app.get('port')) 
    })
    .catch(err => console.log(err));

