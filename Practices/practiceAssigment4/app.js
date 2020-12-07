const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const usersData = require('./routes/users');
const indexData = require('./routes/index');
const rootDir = require('./util/path');


const app = express();
const mainURL = '/Practices/practiceAssigment4';

app.use( bodyParser.urlencoded({extended:false}) );


app.set('view engine','ejs');
// console.log(rootDir);
app.set('views', path.join(rootDir,'views') );


app.use( usersData.router );

app.use( indexData.router );

app.use(mainURL,(req,res,next) => {
    res.status(404).render('404',{docTitle:'404 Page not Found', path: req._parsedUrl.pathname });
});

app.set('port',process.env.PORT || 3000);
app.listen(app.get('port'));