const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const infoData = require('./controllers/info');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');


const User = require('./models/user');                                  //Mongoose model

const app = express();                                                  //Get main express function

app.locals.user = 'BarrierHT';

app.set('view engine','ejs');
app.set('views','views/');                   


app.use( bodyParser.urlencoded( {extended:false} ) );
app.use( express.static( path.join(rootDir,'public') ) );

app.use( (req,res,next) =>{                                                     
    User.findById('600fb0089f5ee63db05cbdd7')
        .then(user => {
            req.user = user;                                                        //* Create a req.user in the middleware
            next();
        })
        .catch(err => console.log(err));
});

app.use('/', infoData.firstMiddleware);

app.use('/admin',adminRoutes.router);                                               //Product and addProduct Routes
app.use(shopRoutes.router);                                                         //Main shop Routes


app.use(infoData.get404);


app.set('port', process.env.PORT || 3000);


let mongoUser = 'administrator';
let mongoPassword = 'VaxS1iEjJcawdinl';
let mongoDatabase = 'Shop';
// console.log(process.env);

mongoose.connect(`mongodb+srv://${mongoUser}:${mongoPassword}@node-course.msdnf.mongodb.net/${mongoDatabase}?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result => {
        // console.log(result);
        return User.findById('6014fc3d8aed0b3f8cee5c66');
    }) 
    .then(user => {
        // console.log('user: ',user,' ',typeof(user));
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




