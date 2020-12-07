const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const users = [];
const mainURL = '/Practices/practiceAssigment4';

router.post(mainURL,(req,res) => {
    users.push({title: req.body['title']});
    res.redirect(301,mainURL + '/users');
});


router.get(mainURL,(req,res) => {
    // console.log(req);
    // console.log( req._parsedUrl.pathname);
    res.render('index',{docTitle:'Main Shop', path: req._parsedUrl.pathname })
});


module.exports = {
    router: router,
    users: users
};