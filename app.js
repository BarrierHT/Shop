const path = require('path');

const express = require('express');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

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

app.locals.user = 'BarrierHT';

app.set('view engine','ejs');
app.set('views','views/');                   
app.set('port', process.env.PORT || 3000);

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

app.use( (req,res,next) => {
    if(req.session.user){
        User.findById(req.session.user._id)
        .then(user => {
            if(user) req.user = user;                                       //Use Mongoose Methods
            next();
        })
        .catch(err => console.log('error: ', err));
    }
    else next();
});

app.use (  (req, res, next) => {                                                        //*Refresh cookie-session time
    // console.log('cookie session1: ',req.session.cookie);
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
            // console.log('cookie: ', cookies);
        } catch (error) {
            console.log('error(TryCatch): ',error);
        }
    }

    next();
});

app.use('/', infoData.firstMiddleware);

app.use('/admin',adminRoutes.router);                                               //Product and addProduct Routes
app.use(shopRoutes.router);                                                         //Main shop Routes
app.use(authRoutes.router);

app.use(infoData.get404);


// console.log(process.env);

mongoose.connect(mongoDBUrl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => User.findById('6014fc3d8aed0b3f8cee5c66')) 
    .then(user => {
        if(!user){
            console.log('hi');
            const user = new User({
                name: 'Ramon',
                email: 'test2@gmail.com',
                password: '111',
                cart: { items: [] }
            });
            return User.insertMany([user]);
        }
    })
    .then( () => app.listen(app.get('port')) )
    .catch(err => console.log(err));




