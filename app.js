const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./util/path');
const infoData = require('./controllers/info');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
<<<<<<< HEAD

const mongoConnect = require('./util/database');    
=======
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
>>>>>>> 2938fcc... SQL(Sequelize) Module finished

const app = express();                                                  //Get main express function

app.locals.user = 'BarrierHT';

app.set('view engine','ejs');
app.set('views','views/');                   


app.use( bodyParser.urlencoded( {extended:false} ) );
app.use( express.static( path.join(rootDir,'public') ) );

app.use( (req,res,next) =>{                                                     
<<<<<<< HEAD
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;                                                        //ToDo Create a req.user in the middleware
    //         next();
    //     })
    //     .catch(err => console.log(err));
    next();
=======
    User.findByPk(1)
        .then(user => {
            req.user = user;                                                        //ToDo Create a req.user in the middleware
            next();
        })
        .catch(err => console.log(err));
>>>>>>> 2938fcc... SQL(Sequelize) Module finished
});

app.use('/', infoData.firstMiddleware);

app.use('/admin',adminRoutes.router);                                               //Product and addProduct Routes
app.use(shopRoutes.router);                                                         //Main shop Routes


app.use(infoData.get404);


app.set('port', process.env.PORT || 3000);

<<<<<<< HEAD
mongoConnect.checkConnection(  () => app.listen(app.get('port')) );
=======
Product.belongsTo(User,{constraints:true, onDelete:'CASCADE', onUpdate:'NO ACTION', targetKey: 'id', as:'user'});        
User.hasMany(Product);

Cart.belongsTo(User,{constraints:true,onDelete:'CASCADE', onUpdate:'NO ACTION', targetKey: 'id'});
User.hasOne(Cart);

Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

Order.belongsTo(User,{constraints:true, onDelete:'CASCADE', onUpdate:'NO ACTION', targetKey: 'id', as:'user'});
User.hasMany(Order);

Order.belongsToMany(Product, {through: OrderItem});
Product.belongsToMany(Order, {through: OrderItem});

sequelize
    .sync()                 //{force:true}
    .then( res => {
       return User.findByPk(1);
    })
    .then( user => {
        if(!user)  return User.create({name:'ThisIsMyName',email:'ThisIsMyEmail'});
        return Promise.resolve(user);
    })
    .then(user => {
        user.getCart() 
            .then(cart =>{
               if(!cart) return user.createCart();
               return Promise.resolve(cart);
            })
            .then(cart =>{
                // console.log('Cart: ',cart);
                app.listen(app.get('port'),'127.0.0.1');
            })
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
>>>>>>> 2938fcc... SQL(Sequelize) Module finished
