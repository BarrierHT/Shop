
const nodemon = require('nodemon');
const express = require('express');

const app = express();


app.use('/',(req,res,next) => {
    console.log('Greetings to all routes');
    next();
});


app.use('/users',(req,res,next) => {
    console.log('Greetings from users tab');
    res.send('<h1 style="color:blue"> Greetings (users tab) from the url: ' + req.originalUrl + '</h1>');
});


app.use('/',(req,res,next) => {
    console.log('Greetings from the main tab');
    res.send('<h1 style="color:green"> Greetings (main tab) from the url: ' + req.originalUrl + '</h1>');
});



app.listen(3000);