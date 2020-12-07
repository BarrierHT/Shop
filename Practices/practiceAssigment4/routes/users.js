const path = require('path');
    
const express = require('express');

const indexData = require('./index');
const rootDir = require('../util/path');

const mainURL = '/Practices/practiceAssigment4';
const router = express.Router();

router.get( mainURL + '/users/',(req,res) => {
    const users = indexData.users;
    // console.log(req._parsedUrl.pathname);
    res.render('users',{docTitle: 'users Menu', users: users, path: req._parsedUrl.pathname });
});

module.exports = {
    router: router
};