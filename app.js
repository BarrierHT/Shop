const path = require('path');

const expressHbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');

const db = require('./util/database');
const infoData = require('./controllers/info');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const rootDir = require('./util/path');

const app = express();                                                  //Get main express function

app.locals.user = 'BarrierHT';

app.set('view engine','ejs');
app.set('views','views/');                   


app.use( bodyParser.urlencoded( {extended:false} ) );
app.use( express.static( path.join(rootDir,'public') ) );

app.use('/', infoData.firstMiddleware);

app.use('/admin',adminRoutes.router);                                               //Product and addProduct Routes

app.use(shopRoutes.router);                                                         //Main shop Routes


db.execute('SELECT * FROM products')
.then( ([rows,fieldData]) => {
    // console.log(rows);
    // console.log(fieldData);
})
.catch(err => {
    console.log('error: ',err);
});

app.use(infoData.get404);


app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'),'127.0.0.1');

